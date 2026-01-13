import express from "express";
import { addStatus, getAllStatus, deleteStatus, updateStatus, getMyStatuses } from "../controllers/statusController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllStatus); 
router.get("/my", authMiddleware, getMyStatuses); 
router.post("/", addStatus); 
router.put("/:id", updateStatus); 
router.delete("/:id", deleteStatus); 


export default router;
