import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { JWT_SECRET } from "../constants/const";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number };
    req.userId = decoded.user_id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
