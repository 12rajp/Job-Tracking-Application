import { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/mailer";
import { RegisterBody } from "../interfaces/auth.interface";
import { VerifyParams } from "../interfaces/auth.interface";
import jwt from "jsonwebtoken";
import { LoginBody } from "../interfaces/auth.interface";

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { user_name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await sendVerificationEmail(email, verifyToken);

    await prisma.user.create({
      data: {
        user_name,
        email,
        password: hashedPassword,
        verifyToken,
        tokenExpiry,
      },
    });

    return res.status(201).json({
      message: "Registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (
  req: Request<VerifyParams>,
  res: Response
) => {
  const { token } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    if (user.tokenExpiry && user.tokenExpiry < new Date()) {
      return res.status(400).send("Token expired");
    }

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        isVerified: true,
        verifyToken: null,
        tokenExpiry: null,
      },
    });

    return res.send("Email verified successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { email, user_name, password } = req.body;

  try {
    const identifier = email || user_name;

    if (!identifier) {
      return res
        .status(400)
        .json({ error: "Email or username required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { user_name: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        resetToken,
        tokenExpiry,
      },
    });

    await sendVerificationEmail(email, resetToken, "passwordReset");

    return res.json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (
  req: Request<{ token: string }>,
  res: Response
) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        resetToken: null,
        tokenExpiry: null,
      },
    });

    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
