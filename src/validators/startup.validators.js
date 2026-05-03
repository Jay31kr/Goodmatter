import { z } from "zod";

// reusable number parser + validator
const numberField = (min = 0) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;

      const num = Number(val);
      return Number.isNaN(num) ? val : num; 
    },
    z.number().min(min).optional()
  );

  //validate sector 
  const validateSector = (data, ctx) => {
  if (data.sector === "Other" && !data.customSector) {
    ctx.addIssue({
      path: ["customSector"],
      message: "customSector required when sector is 'Other'",
      code: z.ZodIssueCode.custom,
    });
  }
};

//base schema for startup profile
const baseStartupSchema = z.object({
  startupName: z.string().trim().min(2).max(100),

  sector: z.enum([
    "Fintech",
    "Edtech",
    "SaaS",
    "Healthtech",
    "AI/ML",
    "Other",
  ]),

  customSector: z.string().trim().max(50).optional(),

  stage: z.enum([
    "Ideation",
    "Pre-seed",
    "Seed",
    "Series-A",
    "Series-B+",
  ]),

  raiseGoal: numberField(0),
  amountRaised: numberField(0),
  revenue: numberField(0),
  teamSize: numberField(1),

  website: z.string().trim().url().optional(),
  bio: z.string().trim().max(500).optional(),
});

// startupprofile Schema
export const StartupProfileSchema = baseStartupSchema.superRefine(validateSector);

//update Profile Schema
export const updateProfileSchema = baseStartupSchema.partial().superRefine(validateSector);

// 🔹 getStartups query schema
export const getStartupsQuerySchema = z
  .object({
    sector: z
      .enum([
        "Fintech",
        "Edtech",
        "SaaS",
        "Healthtech",
        "AI/ML",
        "Other",
      ])
      .optional(),

    stage: z
      .enum([
        "Ideation",
        "Pre-seed",
        "Seed",
        "Series-A",
        "Series-B+",
      ])
      .optional(),

    minTeamSize: numberField(1),
    maxTeamSize: numberField(1),

    minRevenue: numberField(0),
    maxRevenue: numberField(0),

    page: numberField(1),

    limit: numberField(10),
  })
  .superRefine((data, ctx) => {
    // team size range check
    if (
      data.minTeamSize !== undefined &&
      data.maxTeamSize !== undefined &&
      data.minTeamSize > data.maxTeamSize
    ) {
      ctx.addIssue({
        path: ["minTeamSize"],
        message: "minTeamSize cannot be greater than maxTeamSize",
        code: z.ZodIssueCode.custom,
      });
    }

    // revenue range check
    if (
      data.minRevenue !== undefined &&
      data.maxRevenue !== undefined &&
      data.minRevenue > data.maxRevenue
    ) {
      ctx.addIssue({
        path: ["minRevenue"],
        message: "minRevenue cannot be greater than maxRevenue",
        code: z.ZodIssueCode.custom,
      });
    }
  });