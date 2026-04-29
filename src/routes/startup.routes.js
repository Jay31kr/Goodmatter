import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { StartupProfileSchema } from "../validators/startUp.validators.js";
import {completeStartupProfile} from "../controllers/startup.controller.js"

const router =Router();

router.route("/complete-profile").post(verifyJwt,validate(StartupProfileSchema),completeStartupProfile);


export default router;

