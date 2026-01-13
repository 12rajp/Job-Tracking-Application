import express from "express";
import { authMiddleware } from "../middleware/auth";
import {addReminder,getAllReminders,getReminderById,updateReminder,deleteReminder,} from "../controllers/reminderController";

const router = express.Router();

router.get("/", authMiddleware, getAllReminders);
router.get("/:id", authMiddleware, getReminderById);
router.post("/", authMiddleware, addReminder);
router.put("/:id", authMiddleware, updateReminder);
router.delete("/:id", authMiddleware, deleteReminder);

export default router;
