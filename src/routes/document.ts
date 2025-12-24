import express, { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth";
import {addDocument,getAllDocuments,getDocumentById,updateDocument,deleteDocument,downloadDocument,upload,} from "../controllers/documentController";

const router = express.Router();

router.get("/", authMiddleware, getAllDocuments);
router.get("/:id", authMiddleware, getDocumentById);
router.get("/:id/download", authMiddleware, downloadDocument);
router.post("/", authMiddleware, upload.single("file"), addDocument);
router.put("/:id", authMiddleware, updateDocument);
router.delete("/:id", authMiddleware, deleteDocument);

export default router;