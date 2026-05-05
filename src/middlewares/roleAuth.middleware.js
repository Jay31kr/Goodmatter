import { ApiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user) next( new ApiError(401, "User not authenticated"));

        if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
        )
      );
    }
        next();
    }
}