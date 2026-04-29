import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { StartupProfileSchema , updateProfileSchema} from "../validators/startUp.validators.js";
import {completeStartupProfile, updateStartupProfile} from "../controllers/startup.controller.js"

const router =Router();

router.route("/complete-profile").post(verifyJwt,validate(StartupProfileSchema),completeStartupProfile);
router.route("/update-profile").post(verifyJwt , validate(updateProfileSchema), updateStartupProfile);


export default router;

