import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import User from "../models/user.model.js"
import Startup from "../models/startup.model.js";
import { STARTUP_UPDATABLE_FIELDS } from "../constants/startup.constant.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.services.js";
import { removeLocalFile } from "../utils/file.js";

//complete profile
export const completeStartupProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.validatedData;

  if (user.role !== "startup") throw new ApiError(403, "Only startup users can create startup profile");

  const existingProfile = await Startup.findOne({ founder: user._id })
  if (existingProfile) throw new ApiError(400, "Startup profile already exists")

  const startupProfile = await Startup.create({
    founder: user._id,
    ...data,
    isProfileComplete: true,
  });

  return res.status(201)
    .json(
      new ApiResponse(
        201,
        startupProfile,
        "profile created"
      )
    )
});

//update profile
export const updateStartupProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.validatedData;

  if (user.role !== "startup") {
    throw new ApiError(403, "User not allowed to update profile");
  }

  const existingStartupProfile = await Startup.findOne({
    founder: user._id,
  });

  if (!existingStartupProfile) {
    throw new ApiError(404, "Resource not found");
  }

  let updated = false;

  for (const field of STARTUP_UPDATABLE_FIELDS) {
    if (field in data) {
      existingStartupProfile[field] = data[field];
      updated = true;
    }
  }

  if (!updated) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  await existingStartupProfile.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      existingStartupProfile.toObject(),
      "Startup profile updated successfully"
    )
  );
});

//upload pitch deck 
export const uploadPitchDeck = asyncHandler(async (req, res) => {
  const user = req.user;
  const filePath = req.file?.path;

  const existingStartup = await Startup.findOne({ founder: user._id });
  if (!existingStartup) {
    removeLocalFile(filePath);
    throw new ApiError(404, "startup not found")
  }

  if (!filePath) throw new ApiError(400, "Pitch deck file is required");

  let uploaded;

  try {
    uploaded = await uploadToCloudinary(filePath);
  } catch (err) {
    console.log("Cloudinary upload error:", err)
    removeLocalFile(filePath);
    throw new ApiError(500, "failed to upload the pitchdeck")
  }

  if (existingStartup.pitchDeck?.publicId) {
    await deleteFromCloudinary(existingStartup.pitchDeck.publicId);
  }

  existingStartup.pitchDeck = {
    publicId: uploaded.public_id,
    url: uploaded.secure_url,
    uploadedAt: new Date(),
  }

  await existingStartup.save();

  removeLocalFile(filePath);

  return res.status(200).json(
    new ApiResponse(
      200,
      existingStartup.pitchDeck,
      "pitchDexk successfully uploaded"
    )
  );
});

//deleteP Pitch deck
export const deletePitchDeck = asyncHandler(async (req, res) => {

  const user = req.user;
  const existingStarup = await Startup.findOne({ founder: user._id });

  if (!existingStarup || !existingStarup.pitchDeck?.publicId)
    throw new ApiError(404, "Pitch Deck not found");

  try {
    await deleteFromCloudinary(existingStarup.pitchDeck.publicId);;
  } catch (err) {
    console.log("Cloudinary upload error:", err)
    throw new ApiError(500, "failed to delete PitchDeck");
  }

  existingStarup.pitchDeck = undefined;
  await existingStarup.save();

  return res.status(200).
    json(
      new ApiResponse(
        200,
        {},
        "pitchDeck deleted succsfully"
      )
    );
})

//get startup details
export const getMyStartup = asyncHandler(async(req,res)=>{
  const user = req.user;

  const existingStartup = await Startup.findOne({ founder: user._id })
                      .select("-__v -createdAt -updatedAt -pitchDeck.publicId");

  if(!existingStartup) throw new ApiError(404,"startup not found");

  return res.status(200).
        json(
          new ApiResponse(
            200,
            existingStartup,
            "Startup fetched successfully"
          )
        )
});

export const getStartups = asyncHandler(async(req,res)=>{
  const {
     sector,
    stage,
    minTeamSize,
    maxTeamSize,
    minRevenue,
    maxRevenue,
    page,
    limit,    
  }=req.validatedData;

  const filter={};

  if(sector) filter.sector=sector;
  if(stage) filter.stage=stage;

  if(minTeamSize!=undefined || maxTeamSize!=undefined){
    filter.teamSize ={};
     if (minTeamSize !== undefined) filter.teamSize.$gte = minTeamSize;
    if (maxTeamSize !== undefined) filter.teamSize.$lte = maxTeamSize;
  }

   if(minRevenue!=undefined || maxRevenue!=undefined){
    filter.revenue ={};
     if (minRevenue !== undefined) filter.revenue.$gte = minTeamSize;
    if (maxRevenue !== undefined) filter.revenue.$lte = maxTeamSize;
  }

    const startups = await Startup.find(filter)
    .select(
      "startupName sector stage raiseGoal amountRaised revenue teamSize bio website pitchDeck founder"
    )
    .populate("founder", "name email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Startup.countDocuments(filter);
  
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        startups,
        pagination : {
           total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      },
      "Startups fetched successfully"
    )
  );
});