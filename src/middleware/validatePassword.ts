import { Request, Response, NextFunction } from "express";

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const passwordRegex = /^(?=.*\d).{8,}$/; 

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include at least one number.",
    });
  }

  next(); 
};
