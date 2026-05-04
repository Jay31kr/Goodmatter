import {z} from "zod"


// reusable number parser + validator
export const numberField = (min = 0) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;

      const num = Number(val);
      return Number.isNaN(num) ? val : num; 
    },
    z.number().min(min).optional()
  );


    //validate sector 
  export const validateSector = (data, ctx) => {
  if (data.sector === "Other" && !data.customSector) {
    ctx.addIssue({
      path: ["customSector"],
      message: "customSector required when sector is 'Other'",
      code: z.ZodIssueCode.custom,
    });
  }
};

