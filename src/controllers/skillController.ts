import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const getAllSkills = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const skills = await prisma.skill.findMany({
      take,
      skip,
      orderBy: { skill_name: "asc" },
    });

    const total = await prisma.skill.count();

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

export const addSkill = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { skill_name, number_of_year, category } = req.body;

  if (!skill_name) return res.status(400).json({ message: "Skill name is required" });

  try {
    const skill = await prisma.skill.create({
      data: {
        user_id: userId,      
        skill_name,
        number_of_year,
        category,
      },
    });

    return res.status(201).json({ message: "Skill added successfully", skill });
  } catch (error) {
    console.error("ADD SKILL ERROR:", error);
    return res.status(500).json({ message: "Failed to add skill" });
  }
};


export const SkillsByUserId = async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.id);

  try {
    const skills = await prisma.skill.findMany({
      where: { user_id: userId },
      orderBy: { skill_name: "asc" },
    });

    return res.json({ skills });
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response) => {
  const skillId = Number(req.params.id);
  const { skill_name, number_of_year, category } = req.body;

  if (!skillId) {
    return res.status(400).json({ message: "Invalid skill id" });
  }

  try {
    const skill = await prisma.skill.findUnique({ where: { skill_id: skillId } });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user_id !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to update this skill" });
    }

    const updatedSkill = await prisma.skill.update({
      where: { skill_id: skillId },
      data: { skill_name, number_of_year, category },
    });

    return res.json({ message: "Skill updated successfully", skill: updatedSkill });
  } catch (error) {
    console.error("UPDATE SKILL ERROR:", error);
    return res.status(500).json({ message: "Failed to update skill" });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response) => {
  const skillId = Number(req.params.id);

  try {
    await prisma.skill.delete({ where: { skill_id: skillId } });
    return res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);
    return res.status(500).json({ message: "Failed to delete skill" });
  }
};
