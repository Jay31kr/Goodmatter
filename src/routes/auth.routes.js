import { Router } from "express";
import { logIn, logOut, registerUser , verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema , verifyEmailSchema , logInSchema } from "../validators/authValidators.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/signup").post(validate(registerSchema) , registerUser);
router.route("/verify-email").post(validate(verifyEmailSchema) , verifyEmail);
router.route("/login").post(validate(logInSchema) , logIn);
router.route("/logout").post(verifyJwt , logOut);

export default router;