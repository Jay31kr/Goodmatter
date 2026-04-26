import {z} from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number"),

  role: z.enum(["startup", "investor"], {
    errorMap: () => ({ message: "Role must be startup or investor" })
  })
});

export const verifyEmailSchema = z.object({
    email : z.string()
    .trim()
    .lowercase()
    .email({message:"Invalid email address"}),

    otp : z.string()
    .trim()
    .length(6, {message : "otp must be of 6 digit"})
    .regex(/^\d+$/, { message: "OTP must only contain numbers" })
});

export const logInSchema =z.object({
   email : z.string()
    .trim()
    .lowercase()
    .email({message:"Invalid email address"}),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number"),
});