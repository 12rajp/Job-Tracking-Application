import { Router, Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

interface RegisterBody {
  user_name: string;
  password: string;
  email: string;
  full_name?: string;
}

interface LoginBody {
  email: string;
  password: string;
}


router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { user_name, password, email, full_name } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          user_name,
          password: hashedPassword,
          email,
          full_name,
        },
      });

      return res.status(201).json({
        message: "User registered successfully",
        user_id: user.user_id,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
);


router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
);

export default router;
