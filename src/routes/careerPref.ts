import express from "express";
import { authMiddleware } from "../middleware/auth";
import {addCareerPref,CareerPrefByUserId,updateCareerPref,deleteCareerPref,getAllCareerPref,} from "../controllers/careerPrefController";

const router = express.Router();

router.get("/", authMiddleware, getAllCareerPref);
router.get("/:id", authMiddleware, CareerPrefByUserId);
router.post("/", authMiddleware, addCareerPref);
router.put("/:id", authMiddleware, updateCareerPref);
router.delete("/:id", authMiddleware, deleteCareerPref);

export default router;
