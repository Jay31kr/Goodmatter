import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendMail } from "../services/mail.service.js";
import { generateOtp, getOtpExpiry, verifyOtp } from "../utils/otp.js";
import { verificationEmailTemplate } from "../utils/emailTemplates.js";
import cookieOptions from "../constants/constant.js"
import crypto from "crypto";

//signin
export const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password, role } = req.validatedData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User with this email already exists");

  const { plainOtp, hashedOtp } = generateOtp();
  const otpExpiry = getOtpExpiry(10); // 10 minutes

  const user = await User.create({
    name,
    email,
    password,
    role,
    otpHash:  hashedOtp,
    otpExpiry: otpExpiry,
    otpSentAt: new Date(),
  });

  if (!user) throw new ApiError(500, "Internal Server Error: Could not create user");

  try {
    const htmlContent = verificationEmailTemplate(plainOtp, name);
    await sendMail(
      user.email,
      "Verify Your GoodMatter Account",
     htmlContent,
    );

  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new ApiError(500, `Email service error: ${error.message}`);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        userId: user._id,
        email: user.email,
      },
      "Registration successful! Please verify the OTP sent to your email."
    )
  );
});

//verify-email-otp
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.validatedData;
  //fetch user 
  const user = await User.findOne({ email }).select("+otpHash");
  if (!user) throw new ApiError(404, "User not found");
  console.log(otp);
  console.log(user.otpHash)
  if (user.isEmailVerified) throw new ApiError(400, "Email already verified.");
  if (new Date() > user.otpExpiry) throw new ApiError(400, "OTP expired.");
  console.log("reached 1 controller ");
  const isOtpValid = verifyOtp(otp, user.otpHash);
  if (!isOtpValid) throw new ApiError(400, "Invalid OTP");

  user.isEmailVerified = true;
  user.otpHash = undefined;
  user.otpExpiry = undefined;
  user.otpSentAt = undefined;

  const { accessToken, refreshToken } = await user.generateAccessAndRefreshTokens();
  const hashedRefreshToken = crypto.createHash("sha256")
                              .update(refreshToken)
                              .digest("hex");
                              
  user.refreshTokenHash=hashedRefreshToken;
  await user.save();

  return res.
    status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          }
        },
        "email verifed and logged in successfully"
      )
    );
});