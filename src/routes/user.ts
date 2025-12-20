import express from "express";
import { authMiddleware } from "../middleware/auth";
import { updateUser, deleteUser, } from "../controllers/userController";
import { validatePassword } from "../middleware/validatePassword";
import { updatePassword } from "../controllers/userController";

const router = express.Router();

router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.post("/update-password", authMiddleware, validatePassword, updatePassword);
export default router;
