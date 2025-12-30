import express from "express";
import { getAnalytics } from "../controllers/analytic";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getAnalytics);

export default router;
