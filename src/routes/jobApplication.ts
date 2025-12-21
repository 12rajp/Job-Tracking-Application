import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addJobApplication,getMyJobApplications,updateJobApplication,deleteJobApplication, getAllJobApplications,} from "../controllers/jobApplication";

const router = express.Router();


router.get("/:id", authMiddleware, getMyJobApplications);
router.get("/", authMiddleware, getAllJobApplications); 
router.post("/", authMiddleware, addJobApplication);
router.put("/:id", authMiddleware, updateJobApplication);
router.delete("/:id", authMiddleware, deleteJobApplication);

export default router;
