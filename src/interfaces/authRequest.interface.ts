import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: number;
  file?: Express.Multer.File; 
}
