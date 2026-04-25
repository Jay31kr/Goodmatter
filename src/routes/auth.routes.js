import { Router } from "express";
import { registerUser , verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema , verifyEmailSchema } from "../validators/authValidators.js";

const router = Router();

router.route("/signup").post(validate(registerSchema) , registerUser);
router.route("/verify-email").post(validate(verifyEmailSchema) , verifyEmail);


export default router;