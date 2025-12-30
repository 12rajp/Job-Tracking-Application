import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const addSkill = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { skill_name, number_of_year, category } = req.body;

  if (!userId || !skill_name) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let skill = await prisma.skill.findUnique({
      where: { skill_name },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: { skill_name },
      });
    }

    const userSkill = await prisma.userSkill.create({
      data: {
        user_id: userId,
        skill_id: skill.skill_id,
        number_of_year,
        category,
      },
    });

    return res.status(201).json({
      message: "Skill added successfully",
      userSkill,
    });
  } catch (error) {
    if (error instanceof Error && (error as any).code === "P2002") {
      return res.status(409).json({
        message: "Skill already added for this user",
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Failed to add skill" });
  }
};

export const SkillsByUserId = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const skills = await prisma.userSkill.findMany({
      where: { user_id: userId },
      include: {
        skill: true,
      },
      take,
      skip,
      orderBy: { id: "desc" },
    });

    const total = await prisma.userSkill.count({
      where: { user_id: userId },
    });

    return res.json({
      data: skills,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const getAllSkills = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;

  const { take, skip } = getPagination(page, limit);

  try {
    const whereClause = search
      ? {
          skill_name: {
            contains: search,
          },
        }
      : {};

    const skills = await prisma.skill.findMany({
      where: whereClause,
      include: {
        userSkills: {
          include: {
            user: true,
          },
        },
      },
      take,
      skip,
      orderBy: {
        skill_name: "asc",
      },
    });

    const total = await prisma.skill.count({
      where: whereClause,
    });

    return res.json({
      data: skills,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL SKILLS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.userSkill.delete({
      where: { id },
    });

    return res.json({ message: "Skill removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete skill" });
  }
};

export const updateSkillByUserId = async (req: AuthRequest, res: Response) => {
  const userSkillId = Number(req.params.id);
  const { number_of_year, category } = req.body;

  try {
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill) {
      return res.status(404).json({ message: "User skill not found" });
    }

    if (userSkill.user_id !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await prisma.userSkill.update({
      where: { id: userSkillId },
      data: {
        number_of_year,
        category,
      },
    });

    return res.json({
      message: "Skill updated successfully",
      updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Update failed" });
  }
};
