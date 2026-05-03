import { ApiError } from "../utils/apiError.js";

export const validate = (schema, source = "body") => (req, res, next) => {
  const dataToValidate = req[source];
  console.log(dataToValidate);

  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const errorMessages =
      result.error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })) || [];

    return next(new ApiError(400, "Validation failed", errorMessages));
  }

  // store validated data separately per source
  req.validatedData = result.data;

  next();
};