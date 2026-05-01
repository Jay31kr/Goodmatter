import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { StartupProfileSchema , updateProfileSchema} from "../validators/startUp.validators.js";
import {completeStartupProfile, deletePitchDeck, updateStartupProfile, uploadPitchDeck} from "../controllers/startup.controller.js"
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router =Router();

router.route("/complete-profile").post(verifyJwt,validate(StartupProfileSchema),completeStartupProfile);
router.route("/update-profile").post(verifyJwt , validate(updateProfileSchema), updateStartupProfile);
router.route("/pitch-deck").post(verifyJwt , authorizeRoles("startup") , upload.single("pitchDeck") , uploadPitchDeck);
router.route("/pitch-deck").delete(verifyJwt , authorizeRoles("startup") , deletePitchDeck);



export default router;

