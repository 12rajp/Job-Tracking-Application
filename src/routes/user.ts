import express, { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, initMailer } from "../utils/mailer";
import { RegisterBody, VerifyParams,LoginBody } from "../interfaces/auth.interface";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
initMailer();

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
  ) => {
    const { user_name, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyToken = uuidv4();
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 

      await prisma.user.create({
        data: {
          user_name,
          email,
          password: hashedPassword,
          verifyToken,
          tokenExpiry,
        },
      });

      await sendVerificationEmail(email, verifyToken);

      return res.status(201).json({
        message: "Registered successfully. Please verify your email.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

router.get(
  "/verify/:token",
  async (
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

      return res.send("✅ Email verified successfully!");
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);


    router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, user_name, password } = req.body;

    const identifier = email || user_name;
    if (!identifier) return res.status(400).json({ error: "Email or username required" });

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { user_name: identifier },
        ],
      },
    });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ message: "Login successful", token });
  }
);

export default router;
