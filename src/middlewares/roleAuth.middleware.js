import { ApiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user) throw new ApiError(401, "User not authenticated");

        if(!allowedRoles.includes(req.user.role)) 
            throw new ApiError(403 , `Access dinied alloed role for the operation are ${allowedRoles.join(", ")}`);

        next();
    }
}