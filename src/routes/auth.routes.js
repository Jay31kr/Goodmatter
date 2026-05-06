import { Router } from "express";
import { logIn, logOut, registerUser , resendOtp, resetTokens, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema , verifyEmailSchema , logInSchema , resendOtpSchema } from "../validators/authValidators.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyRefreshToken } from "../middlewares/verifyRefreshToken.middleware.js";
import { authLimiter , refreshLimiter, otpLimiter} from "../middlewares/rateLimiter.js";
const router = Router();

router.route("/signup").post(authLimiter, validate(registerSchema) , registerUser);
router.route("/verify-email").post(authLimiter,validate(verifyEmailSchema) , verifyEmail);
router.route("/login").post(authLimiter , validate(logInSchema) , logIn);
router.route("/logout").post(verifyJwt , logOut);
router.route("/resend-otp").post(otpLimiter,validate(resendOtpSchema) , resendOtp);
router.route("/refresh-token").post(refreshLimiter,verifyRefreshToken,refreshLimiter,resetTokens);

export default router;