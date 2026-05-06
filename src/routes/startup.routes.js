import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  StartupProfileSchema,
  updateProfileSchema,
  getStartupsQuerySchema
} from "../validators/startup.validators.js";
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
import { perUserLimiter, pitchDeckLimiter } from "../middlewares/rateLimiter.js";


const router = Router();


router.use(
  verifyJwt,
  perUserLimiter
);

// Create + Update profile
router
  .route("/")
  .post(
    authorizeRoles("startup"),
    validate(StartupProfileSchema),
    completeStartupProfile
  )
  .patch(
    authorizeRoles("startup"),
    validate(updateProfileSchema),
    updateStartupProfile
  );

// Get own startup
router.get(
  "/me",
  authorizeRoles("startup"),
  getMyStartup
);

// Pitch deck
router
  .route("/pitch-deck")
  .post(
    pitchDeckLimiter,
    authorizeRoles("startup"),
    upload.single("pitchDeck"),
    uploadPitchDeck
  )
  .patch(
    pitchDeckLimiter,
    authorizeRoles("startup"),
    upload.single("pitchDeck"),
    uploadPitchDeck
  )
  .delete(
    pitchDeckLimiter,
    authorizeRoles("startup"),
    deletePitchDeck
  );

  router
    .route("/startups")
    .get(
        authorizeRoles("investor"),
        validate(getStartupsQuerySchema , "query"),
        getStartups,
    );

 

export default router;