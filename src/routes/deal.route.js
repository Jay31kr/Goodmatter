import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { createDealSchema , myDealQuerySchema , dealParamsSchema , updateDealSchema,dealQuerySchema} from "../validators/deal.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDeal, getMyDeals , updateDealStatusByInvestor,getDealsForStartup,updateDealStatusByStartup } from "../controllers/deal.controller.js";
import { perUserLimiter, sendInterestLimiter } from "../middlewares/rateLimiter.js";

const router =Router();

router.use(
   verifyJwt,
   perUserLimiter
);

router.route("/").post(
    sendInterestLimiter,
    authorizeRoles("investor"),
    validate(createDealSchema),
    createDeal);

router.route("/me").get(
    authorizeRoles("investor"), 
    validate(myDealQuerySchema , "query"), 
    getMyDeals);

router.route("/:dealId/investor-action").patch( 
    sendInterestLimiter,
    authorizeRoles("investor"),
    validate(dealParamsSchema, "params"),
    validate(updateDealSchema, "body"),
    updateDealStatusByInvestor)

router.route( "/startup").get(
  authorizeRoles("startup"),
  validate(dealQuerySchema, "query"), 
  getDealsForStartup
);


router.route("/:dealId/startup-action").patch( 
    authorizeRoles("startup"),
    validate(dealParamsSchema, "params"),
    validate(updateDealSchema, "body"),
    updateDealStatusByStartup)


export default router;