import express from "express";
import {registerUser,verifyEmail,loginUser,requestPasswordReset,resetPassword,} from "../controllers/authController";
import { validatePassword } from "../middleware/validatePassword";

const router = express.Router();

router.post("/register", validatePassword, registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/reset-password/request", requestPasswordReset);
router.post("/reset-password/:token", validatePassword, resetPassword);

export default router;
