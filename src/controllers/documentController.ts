import { Response, Request } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/documents";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF and DOC files allowed!"));
  },
});

export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const documents = await prisma.document.findMany({
      where: { user_id: userId },
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        application: true,
      },
    });

    const total = await prisma.document.count({
      where: { user_id: userId },
    });

    return res.json({
      data: documents,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL DOCUMENTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const addDocument = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { doc_name, doc_type, app_id } = req.body;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({ message: "User ID and file are required" });
  }

  try {
    const document = await prisma.document.create({
      data: {
        user_id: userId,
        ...(app_id && { app_id: Number(app_id) }),
        doc_name: doc_name || file.originalname,
        doc_type: doc_type || "Resume",
        file_path: file.path,
        size: Math.round(file.size / 1024),
      },
    });

    return res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("ADD DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to upload document" });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  const docId = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({
      where: { doc_id: docId },
      include: { application: true },
    });

    if (!document) return res.status(404).json({ message: "Document not found" });

    return res.json({ document });
  } catch (error) {
    console.error("GET DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch document" });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  const docId = Number(req.params.id);
  const { doc_name, doc_type } = req.body;

  try {
    const document = await prisma.document.findUnique({ where: { doc_id: docId } });
    if (!document) return res.status(404).json({ message: "Document not found" });

    if (document.user_id !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedDocument = await prisma.document.update({
      where: { doc_id: docId },
      data: { doc_name, doc_type },
    });

    return res.json({ message: "Document updated successfully", document: updatedDocument });
  } catch (error) {
    console.error("UPDATE DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to update document" });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  const docId = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({ where: { doc_id: docId } });
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.user_id !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    await prisma.document.delete({ where: { doc_id: docId } });
    return res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to delete document" });
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response) => {
  const docId = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({ where: { doc_id: docId } });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(document.file_path, document.doc_name);
  } catch (error) {
    console.error("DOWNLOAD DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to download document" });
  }
};
