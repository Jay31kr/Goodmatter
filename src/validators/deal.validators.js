import { z } from "zod"
import { numberField } from "../utils/validation.util.js"
import mongoose from "mongoose"

export const createDealSchema = z.object({
    startupId: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid startupId",
        }),

    offerAmount: numberField(10000),

    message: z
        .string()
        .trim()
        .max(1000, "Message cannot exceed 1000 characters")
        .optional(),
});

export const myDealQuerySchema = z
  .object({
    status: z
      .enum(["interested", "accepted", "rejected", "closed"])
      .optional(),

    minOffer: numberField(10000),
    maxOffer: numberField(0),

    page: numberField(1),
    limit: numberField(10),
  })
  .superRefine((data, ctx) => {
    if (
      data.minOffer !== undefined &&
      data.maxOffer !== undefined &&
      data.minOffer > data.maxOffer
    ) {
      ctx.addIssue({
        path: ["minOffer"],
        message: "minOffer cannot be greater than maxOffer",
        code: z.ZodIssueCode.custom,
      });
    }
  });

  export const dealParamsSchema= z.object({
    dealId:z.string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid startupId",
        }),
  });

export const updateDealSchema = z.object({
  status: z.enum(["accept", "reject", "withdraw", "close"]),
});

export const dealQuerySchema = z.object({
  page: numberField(1).default(1),

  limit: numberField(1, 50).default(10),

  status: z
    .enum(["interested", "accepted", "rejected", "withdrawn", "closed"])
    .optional(),
});