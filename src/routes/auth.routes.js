import { Router } from "express";
import { logIn, logOut, registerUser , resendOtp, resetTokens, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema , verifyEmailSchema , logInSchema , resendOtpSchema } from "../validators/authValidators.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyRefreshToken } from "../middlewares/verifyRefreshToken.middleware.js";
const router = Router();

router.route("/signup").post(validate(registerSchema) , registerUser);
router.route("/verify-email").post(validate(verifyEmailSchema) , verifyEmail);
router.route("/login").post(validate(logInSchema) , logIn);
router.route("/logout").post(verifyJwt , logOut);
router.route("/resend-otp").post(validate(resendOtpSchema) , resendOtp);
router.route("/refresh-token").post(verifyRefreshToken,resetTokens);

export default router;