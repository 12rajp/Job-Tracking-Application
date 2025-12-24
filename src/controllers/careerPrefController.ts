import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const addCareerPref = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Please log in to access this feature." });
  }

  const { pref_industry, pref_role, pref_location, min_salary, max_salary, work_type } = req.body;

  if (!pref_industry || !pref_role) {
    return res.status(400).json({ message: "Industry and Role are required" });
  }

  try {
    const existing = await prisma.careerPreference.findUnique({ where: { user_id: userId } });
    if (existing) return res.status(400).json({ message: "Career preference already exists" });

    const careerPref = await prisma.careerPreference.create({
      data: {
        user_id: userId, 
        pref_industry,
        pref_role,
        pref_location,
        min_salary,
        max_salary,
        work_type,
      },
    });

    return res.status(201).json({ message: "Career preference added", careerPref });
  } catch (error) {
    console.error("ADD CAREER PREF ERROR:", error);
    return res.status(500).json({ message: "Failed to add career preference" });
  }
};

export const CareerPrefByUserId = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  try {
    const careerPref = await prisma.careerPreference.findUnique({ where: { user_id: userId } });
    if (!careerPref) return res.status(404).json({ message: "Career preference not found" });

    return res.json({ careerPref });
  } catch (error) {
    console.error("GET CAREER PREF ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch career preference" });
  }
};

export const updateCareerPref = async (req: AuthRequest, res: Response) => {
  const prefId = Number(req.params.id);
  const { pref_industry, pref_role, pref_location, min_salary, max_salary, work_type } = req.body;

  try {
    const careerPref = await prisma.careerPreference.findUnique({ where: { pref_id: prefId } });
    if (!careerPref) return res.status(404).json({ message: "Career preference not found" });
    if (careerPref.user_id !== req.userId) return res.status(403).json({ message: "Not allowed to update this preference" });

    const updated = await prisma.careerPreference.update({
      where: { pref_id: prefId },
      data: { pref_industry, pref_role, pref_location, min_salary, max_salary, work_type },
    });

    return res.json({ message: "Career preference updated", careerPref: updated });
  } catch (error) {
    console.error("UPDATE CAREER PREF ERROR:", error);
    return res.status(500).json({ message: "Failed to update career preference" });
  }
};

export const deleteCareerPref = async (req: AuthRequest, res: Response) => {
  const prefId = Number(req.params.id);

  try {
    const careerPref = await prisma.careerPreference.findUnique({ where: { pref_id: prefId } });
    if (!careerPref) return res.status(404).json({ message: "Career preference not found" });
    if (careerPref.user_id !== req.userId) return res.status(403).json({ message: "Not allowed to delete this preference" });

    await prisma.careerPreference.delete({ where: { pref_id: prefId } });
    return res.json({ message: "Career preference deleted" });
  } catch (error) {
    console.error("DELETE CAREER PREF ERROR:", error);
    return res.status(500).json({ message: "Failed to delete career preference" });
  }
};

export const getAllCareerPref = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const careerPrefs = await prisma.careerPreference.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
        include: {
        user: true,
      },
    });

    const total = await prisma.careerPreference.count();

    return res.json({
      data: careerPrefs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL CAREER PREF ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch career preferences" });
  }
};
  