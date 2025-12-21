import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const documents = await prisma.document.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        application: true
      }
    });

    const total = await prisma.document.count();

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
  const { app_id, doc_name, doc_type, file_path } = req.body;

  if (!userId || !app_id || !doc_name || !doc_type || !file_path) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const document = await prisma.document.create({
      data: {
        user_id: userId,
        app_id,
        doc_name,
        doc_type,
        file_path
      }
    });

    return res.status(201).json({ message: "Document added successfully", document });

  } catch (error) {
    console.error("ADD DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to add document" });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  const docId = Number(req.params.id);

  try {
    const document = await prisma.document.findUnique({
      where: { doc_id: docId },
      include: { user: true, application: true }
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
  const { doc_name, doc_type, file_path } = req.body;

  try {
    const document = await prisma.document.findUnique({ where: { doc_id: docId } });
    if (!document) return res.status(404).json({ message: "Document not found" });

    if (document.user_id !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to update this document" });
    }

    const updatedDocument = await prisma.document.update({
      where: { doc_id: docId },
      data: { doc_name, doc_type, file_path },
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
    await prisma.document.delete({ where: { doc_id: docId } });
    return res.json({ message: "Document deleted successfully" });

  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);
    return res.status(500).json({ message: "Failed to delete document" });
  }
};
