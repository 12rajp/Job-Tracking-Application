import { Router } from "express";
import { getMyNotifications } from "../controllers/notificationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/my", authMiddleware, getMyNotifications);

export default router;
