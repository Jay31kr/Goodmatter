import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import User from "../models/user.model.js"
import Startup from "../models/startup.model.js";
import { STARTUP_UPDATABLE_FIELDS } from "../constants/startup.constant.js";

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