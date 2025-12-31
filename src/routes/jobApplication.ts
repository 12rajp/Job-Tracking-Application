import express from "express";
import { authMiddleware } from "../middleware/auth";
import {addJobApplication,getAllJobApplications,getJobApplicationById,updateJobApplication,deleteJobApplication,uploadApplicationFile,} from "../controllers/jobApplication";

const router = express.Router();

router.post("/",authMiddleware,uploadApplicationFile.single("file"),addJobApplication);
router.get("/:userId", authMiddleware, getAllJobApplications);
router.get("/application/:id", authMiddleware, getJobApplicationById);
router.put("/:id", authMiddleware, updateJobApplication);
router.delete("/:id", authMiddleware, deleteJobApplication);

export default router;
