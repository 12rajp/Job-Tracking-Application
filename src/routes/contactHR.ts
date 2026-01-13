import express from "express";
import { authMiddleware } from "../middleware/auth";
import {addContactHR,getAllContactHRs, getContactHRById,updateContactHR,deleteContactHR,} from "../controllers/contactHRController";

const router = express.Router();

router.get("/", authMiddleware, getAllContactHRs);
router.get("/:id", authMiddleware, getContactHRById);
router.post("/", authMiddleware, addContactHR);
router.put("/:id", authMiddleware, updateContactHR);
router.delete("/:id", authMiddleware, deleteContactHR);

export default router;
