import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addSkill, SkillsByUserId, updateSkillByUserId, deleteSkill, getAllSkills } from "../controllers/skillController";

const router = express.Router();

router.get("/", authMiddleware, getAllSkills);
router.get("/:id", authMiddleware, SkillsByUserId);
router.post("/", authMiddleware, addSkill);        
router.put("/:id", authMiddleware, updateSkillByUserId);   
router.delete("/:id", authMiddleware, deleteSkill);

export default router;
