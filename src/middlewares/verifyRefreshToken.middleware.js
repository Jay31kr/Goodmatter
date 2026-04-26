import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const verifyRefreshToken = asyncHandler(async(req, res, next)=>{
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!refreshToken) throw new ApiError(401 , "Refresh Token required");

    const decodedToken = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select("+refreshTokenHash");
    if(!user) throw new ApiError(401 , "Invalid Refresh Token");
    
    const hashedIncomingToken = crypto.createHash("sha256")
      .update(refreshToken)
      .digest("hex");

      if(hashedIncomingToken !== user.refreshTokenHash) throw new ApiError(401 , "Refresh token is expired or already used");

      req.user=user;
      next();
});