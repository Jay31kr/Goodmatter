import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  StartupProfileSchema,
  updateProfileSchema,
  getStartupsQuerySchema
} from "../validators/startUp.validators.js";
import {
  completeStartupProfile,
  updateStartupProfile,
  getMyStartup,
  uploadPitchDeck,
  deletePitchDeck,
  getStartups
} from "../controllers/startup.controller.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Create + Update profile
router
  .route("/")
  .post(
    verifyJwt,
    authorizeRoles("startup"),
    validate(StartupProfileSchema),
    completeStartupProfile
  )
  .patch(
    verifyJwt,
    authorizeRoles("startup"),
    validate(updateProfileSchema),
    updateStartupProfile
  );

// Get own startup
router.get(
  "/me",
  verifyJwt,
  authorizeRoles("startup"),
  getMyStartup
);

// Pitch deck
router
  .route("/pitch-deck")
  .post(
    verifyJwt,
    authorizeRoles("startup"),
    upload.single("pitchDeck"),
    uploadPitchDeck
  )
  .delete(
    verifyJwt,
    authorizeRoles("startup"),
    deletePitchDeck
  );

  router
    .route("/startups")
    .get(
        verifyJwt,
        authorizeRoles("investor"),
        validate(getStartupsQuerySchema , "query"),
        getStartups,
    );

 

export default router;