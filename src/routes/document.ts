import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addDocument, getAllDocuments, getDocumentById, updateDocument, deleteDocument } from "../controllers/documentController";

const router = express.Router();

router.get("/", authMiddleware, getAllDocuments);
router.get("/:id", authMiddleware, getDocumentById);
router.post("/", authMiddleware, addDocument);
router.put("/:id", authMiddleware, updateDocument);
router.delete("/:id", authMiddleware, deleteDocument);

export default router;
