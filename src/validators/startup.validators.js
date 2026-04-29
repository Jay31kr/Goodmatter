import { z } from "zod";

// reusable number parser + validator
const numberField = (min = 0) =>
  z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);

    if (Number.isNaN(num)) return undefined;
    return num;
  }, z.number().min(min));

// startupprofile Schema
export const StartupProfileSchema = z
  .object({
    startupName: z
      .string()
      .trim()
      .min(2, "startup name too short")
      .max(100, "Too Long"),

    sector: z.enum(
      ["Fintech", "Edtech", "SaaS", "Healthtech", "AI/ML", "Other"],
      {
        errorMap: () => ({
          message: "sector must be one of the given options",
        }),
      }
    ),

    customSector: z.string().trim().max(50).optional(),

    stage: z.enum(
      ["Ideation", "Pre-seed", "Seed", "Series-A", "Series-B+"],
      {
        errorMap: () => ({
          message: "stage must be one of the given options",
        }),
      }
    ),

    raiseGoal: numberField(0),
    amountRaised: numberField(0),
    revenue: numberField(0),
    teamSize: numberField(1),

    website: z.string().trim().optional(),

    bio: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sector === "Other" && !data.customSector) {
      ctx.addIssue({
        path: ["customSector"],
        message: "customSector required when sector is 'Other'",
        code: z.ZodIssueCode.custom,
      });
    }
  });