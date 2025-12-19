import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

const passwordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => val.split("").some((c) => c >= "0" && c <= "9"), {
      message: "Password must contain at least one number",
    }),
});

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    passwordSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0].message,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
