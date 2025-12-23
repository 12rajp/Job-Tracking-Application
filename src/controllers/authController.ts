import { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterBody, LoginBody, VerifyParams } from "../interfaces/auth.interface";
import { sendEmailWithToken } from "../utils/mailer";
import { JWT_SECRET, EMAIL_JWT_SECRET } from "../constants/const";

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { user_name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = jwt.sign({ email }, EMAIL_JWT_SECRET, { expiresIn: "1h" });
 await sendEmailWithToken (email, emailToken);
    await prisma.user.create({
      data: {
        user_name,
        email,
        password: hashedPassword,
        verifiedAt: null, 
      },
    });

    return res.status(201).json({ message: "Registered successfully. Please verify your email." });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request<VerifyParams>, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, EMAIL_JWT_SECRET) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) return res.status(400).send("User not found");
    if (user.verifiedAt) return res.send("Email already verified!");

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { verifiedAt: new Date() },
    });

    return res.send("Email verified successfully!");
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return res.status(400).send("Invalid or expired token");
  }
};

export const loginUser = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, user_name, password } = req.body;

  try {
    const identifier = email || user_name;
    if (!identifier) return res.status(400).json({ error: "Email or username required" });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { user_name: identifier }] },
    });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: "Invalid password" });

    if (!user.verifiedAt) return res.status(403).json({ message: "Please verify your email before login." });

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ email }, EMAIL_JWT_SECRET, { expiresIn: "1h" });

    await sendEmailWithToken(email, resetToken, "passwordReset");

    return res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("REQUEST RESET ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request<{ token: string }>, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, EMAIL_JWT_SECRET) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

