export const validate = (schema) => (req, res, next) => {
  console.log("validate reach")
  const result = schema.safeParse(req.body);

  if (!result.success) {
    console.log("fails");
    // FIX: Added ?. to prevent "reading properties of undefined"
    const errorMessages = result.error?.errors?.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    })) || [];
    
    return next(new ApiError(400, "Validation failed!!", errorMessages));
  }

  req.validatedData = result.data;
  next();
};