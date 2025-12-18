import express from "express";
import { authMiddleware } from "../middleware/auth";
import { updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.put("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteUser);

export default router;
