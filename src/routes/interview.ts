import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addInterview,getAllInterviews,getInterviewById, updateInterview,deleteInterview,} from "../controllers/interviewController";

const router = express.Router();

router.get("/", authMiddleware, getAllInterviews);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/", authMiddleware, addInterview);
router.put("/:id", authMiddleware, updateInterview);
router.delete("/:id", authMiddleware, deleteInterview);

export default router;
