import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const getAllInterviews = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const interviews = await prisma.interview.findMany({
      take,
      skip,
      orderBy: { interview_at: "asc" },
      include: { application: true },
    });

    const total = await prisma.interview.count();

    return res.json({
      data: interviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL INTERVIEWS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch interviews" });
  }
};

export const addInterview = async (req: AuthRequest, res: Response) => {
  const { app_id, round_num, interview_at, interview_type, interviewer, location, duration, notes } = req.body;

  if (!app_id || !round_num || !interview_at || !interview_type) {
    return res.status(400).json({
      message: "app_id, round_num, interview_at, and interview_type are required",
    });
  }

  try {
    const interview = await prisma.interview.create({
      data: { app_id, round_num, interview_at, interview_type, interviewer, location, duration, notes },
    });

    return res.status(201).json({ message: "Interview added successfully", interview });
  } catch (error) {
    console.error("ADD INTERVIEW ERROR:", error);
    return res.status(500).json({ message: "Failed to add interview" });
  }
};

export const getInterviewById = async (req: AuthRequest, res: Response) => {
  const interId = Number(req.params.id);

  try {
    const interview = await prisma.interview.findUnique({
      where: { inter_id: interId },
      include: { application: true },
    });

    if (!interview) return res.status(404).json({ message: "Interview not found" });

    return res.json({ interview });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch interview" });
  }
};

export const updateInterview = async (req: AuthRequest, res: Response) => {
  const interId = Number(req.params.id);
  const { round_num, interview_at, interview_type, interviewer, location, duration, notes } = req.body;

  try {
    const interview = await prisma.interview.findUnique({ where: { inter_id: interId } });
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const updatedInterview = await prisma.interview.update({
      where: { inter_id: interId },
      data: { round_num, interview_at, interview_type, interviewer, location, duration, notes },
    });

    return res.json({ message: "Interview updated successfully", interview: updatedInterview });
  } catch (error) {
    console.error("UPDATE INTERVIEW ERROR:", error);
    return res.status(500).json({ message: "Failed to update interview" });
  }
};

export const deleteInterview = async (req: AuthRequest, res: Response) => {
  const interId = Number(req.params.id);

  try {
    await prisma.interview.delete({ where: { inter_id: interId } });
    return res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("DELETE INTERVIEW ERROR:", error);
    return res.status(500).json({ message: "Failed to delete interview" });
  }
};
