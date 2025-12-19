import express from "express";
import {registerUser,verifyEmail,loginUser,requestPasswordReset,resetPassword,updatePassword} from "../controllers/authController";
import { validatePassword } from "../middleware/validatePassword";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", validatePassword, registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/reset-password/request", requestPasswordReset);
router.post("/reset-password/:token", validatePassword, resetPassword);
router.post("/update-password", authMiddleware, validatePassword, updatePassword);

export default router;
