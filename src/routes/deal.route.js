import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { createDealSchema , myDealQuerySchema , dealParamsSchema , updateDealSchema,dealQuerySchema} from "../validators/deal.validators.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDeal, getMyDeals , updateDealStatusByInvestor,getDealsForStartup } from "../controllers/deal.controller.js";

const router =Router();

router.route("/").post(
    verifyJwt, 
    authorizeRoles("investor"),
    validate(createDealSchema),
    createDeal);

router.route("/me").get(
    verifyJwt, 
    authorizeRoles("investor"), 
    validate(myDealQuerySchema , "query"), 
    getMyDeals);

router.route("/:dealId/investor-action").patch( 
    verifyJwt, 
    authorizeRoles("investor"),
    validate(dealParamsSchema, "params"),
    validate(updateDealSchema, "body"),
    updateDealStatusByInvestor)

router.route( "/startup").get(
  verifyJwt,
  authorizeRoles("startup"),
  validate(dealQuerySchema, "query"), 
  getDealsForStartup
);


export default router;