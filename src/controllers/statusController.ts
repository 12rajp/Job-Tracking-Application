import { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const addStatus = async (req: Request, res: Response) => {
  const { status_name } = req.body;
  if (!status_name) return res.status(400).json({ message: "Status name required" });

  try {
    const status = await prisma.status.create({
      data: { status_name },
    });
    res.status(201).json({ message: "Status added", status });
  } catch (error) {
    console.error("ADD STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to add status" });
  }
};

export const getAllStatus = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const statuses = await prisma.status.findMany({
      take,
      skip,
      orderBy: { status_name: "asc" },
    });

    const total = await prisma.status.count();

    res.json({
      data: statuses,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch statuses" });
  }
};

export const getMyStatuses = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const statuses = await prisma.jobApplication.findMany({
      where: { user_id: userId },
      select: {
        status: true,
        position_title: true,
        company: { select: { company_name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: statuses });
  } catch (error) {
    console.error("GET MY STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your statuses" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status_name } = req.body;
  if (!status_name) return res.status(400).json({ message: "Status name required" });

  try {
    const updated = await prisma.status.update({
      where: { status_id: id },
      data: { status_name },
    });

    res.json({ message: "Status updated", status: updated });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deleteStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.status.delete({ where: { status_id: id } });
    res.json({ message: "Status deleted" });
  } catch (error) {
    console.error("DELETE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to delete status" });
  }
};
