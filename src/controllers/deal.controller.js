import User from "../models/user.model.js"
import Startup from "../models/startup.model.js"
import Deal from "../models/deal.model.js"
import {INVESTOR_ACTIONS} from "../constants/deal.constant.js"
import { STARTUP_ACTIONS } from "../constants/deal.constant.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const createDeal = asyncHandler(async (req, res) => {
  const { startupId, offerAmount, message } = req.validatedData.body;
  const user = req.user;

  const startup = await Startup.findById(startupId);
  if (!startup) {
    throw new ApiError(404, "Startup not found");
  }

  // 🔥 pre-check
  const existingDeal = await Deal.findOne({
    investor: user._id,
    startup: startup._id,
    status: { $in: ["interested", "accepted"] },
  });

  if (existingDeal) {
    throw new ApiError(
      400,
      "An active deal already exists with this startup"
    );
  }

  let newDeal;

  try {
    newDeal = await Deal.create({
      investor: user._id,
      startup: startup._id,
      offerAmount,
      message,
    });
  } catch (err) {
    if (err.code === 11000) {
      // 🔥 still needed for race condition safety
      throw new ApiError(
        400,
        "An active deal already exists with this startup"
      );
    }
    throw err;
  }

  return res.status(201).json(
    new ApiResponse(201, newDeal, "Deal initiated successfully")
  );
});


export const getMyDeals = asyncHandler(async (req, res) => {
  const { status, minOffer, maxOffer, page, limit } = req.validatedData.query;
  const user = req.user;

  const filter = {
    investor: user._id,
  };

  if (status) filter.status = status;

  if (minOffer !== undefined || maxOffer !== undefined) {
    filter.offerAmount = {};

    if (minOffer !== undefined) {
      filter.offerAmount.$gte = minOffer;
    }

    if (maxOffer !== undefined) {
      filter.offerAmount.$lte = maxOffer;
    }
  }

  const deals = await Deal.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Deal.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      deals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "offers fetched successfully")
  );
});

export const updateDealStatusByInvestor = asyncHandler(async(req,res,)=>{

    const {dealId} = req.validatedData.params;
    const {status} = req.validatedData.body;
    const user=req.user;

    const deal = await Deal.findById(dealId);

    if(!deal) throw new ApiError(404, "Deal not found");

    if(deal.investor.toString() !== user._id.toString()){
        throw new ApiError(403 , "not authorized to update this deal");
    }

    const currentStatus = deal.status;

    if(!INVESTOR_ACTIONS[status]){
        throw new ApiError(400 , `${status} update not allowed`);
    }

    if(!INVESTOR_ACTIONS[status].includes(currentStatus)){
        throw new ApiError(400 , `Cannot ${status} when the current state is ${currentStatus}`);
    }

    if(status=="withdraw"){
        deal.status="withdrawn";
    }else if(status=="close"){
        deal.status="closed";
    }

    await deal.save();

     return res.status(200).json(
    new ApiResponse(200, deal, `Deal updated successfully`)
  );

});

export const getDealsForStartup =asyncHandler(async(req,res)=>{
    const {
        status,
        page,
        limit,
    }=req.validatedData.query;
    const user = req.user;

    const startup = await Startup.findOne({founder:user._id});

    const filter ={
        startup:startup._id,
    };

    if(status) filter.status=status;

    const deals = await Deal.find(filter)
                        .skip((page-1)*limit)
                        .limit(limit)
                        .sort({ createdAt: -1 })
    if(!deals) throw new ApiError(404 , "No deal found for your startup");

    const total = await Deal.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                deals,
                pagination:{
                    total,
                    page,
                    limit,
                    totalPage : Math.ceil(total / limit)
                }
            },
            "Deals fetched successfully"
        )
    )
});

export const updateDealStatusByStartup = asyncHandler(async (req, res) => {
  const { dealId } = req.validatedData.params;
  const { status } = req.validatedData.body;
  const user = req.user;

  const startup = await Startup.findOne({ founder: user._id });
  if (!startup) {
    throw new ApiError(404, "Startup not found for this user");
  }

  const deal = await Deal.findById(dealId);
  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  if (deal.startup.toString() !== startup._id.toString()) {
    throw new ApiError(403, "Not authorized to act on this deal");
  }

  const currentStatus = deal.status;

  if (!STARTUP_ACTIONS[status]) {
    throw new ApiError(400, "Invalid action for startup");
  }

  if (!STARTUP_ACTIONS[status].includes(currentStatus)) {
    throw new ApiError(
      400,
      `Cannot ${action} deal when status is '${currentStatus}'`
    );
  }

  if (status === "accept") {
    deal.status = "accepted";
  } else if (status === "reject") {
    deal.status = "rejected";
  }

  await deal.save();

  return res.status(200).json(
    new ApiResponse(200, deal, `Deal ${status}ed successfully`)
  );
});