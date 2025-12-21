import { Request, Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";
import {PaginationQuery} from "../interfaces/pagination.interface"

export const addJobApplication = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  const {
    company_id,
    status_id,
    position_title,
    job_description,
    job_link,
    location,
    job_type,
    date_applied,
    application_deadline,
    salary_offered,
  } = req.body;

  // if (!company_id || !status_id || !position_title || !date_applied || !job_type) {
  //   return res.status(400).json({ message: "Required fields are missing" });
  // }
const requiredFields = { company_id, status_id, position_title, date_applied, job_type };
const missingFields = Object.entries(requiredFields)
  .filter(([_, value]) => value === undefined || value === null || value === "")
  .map(([key]) => key);

if (missingFields.length > 0) {
  return res.status(400).json({ 
    message: `Required fields are missing: ${missingFields.join(", ")}` 
  });
}

  try {
    const application = await prisma.jobApplication.create({
      data: {
        user_id: userId!,
        company_id,
        status_id,
        position_title,
        job_description,
        job_link,
        location,
        job_type,
        date_applied: new Date(date_applied),
        application_deadline: application_deadline
          ? new Date(application_deadline)
          : null,
        salary_offered,
      },
    });

    return res.status(201).json({
      message: "Job application added successfully",
      application,
    });
  } catch (error) {
    console.error("ADD JOB APPLICATION ERROR:", error);
    return res.status(500).json({ message: "Failed to add job application" });
  }
};

export const getMyJobApplications = async (req: AuthRequest, res: Response) => {
  const requestedUserId = Number(req.params.id);

  if (requestedUserId !== req.userId) {
    return res.status(403).json({ message: "You can only access your own applications" });
  }

  try {
    const applications = await prisma.jobApplication.findMany({
      where: { user_id: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data: applications });
  } catch (error) {
    console.error("GET JOB APPLICATIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch job applications" });
  }
};

export const getAllJobApplications = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { take, skip } = getPagination(page, limit);

  try {
    const applications = await prisma.jobApplication.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.jobApplication.count();

    res.json({
      data: applications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET ALL JOB APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
};

export const updateJobApplication = async (req: AuthRequest, res: Response) => {
  const appId = Number(req.params.id);

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { app_id: appId },
    });

    if (!application)
      return res.status(404).json({ message: "Job application not found" });

    if (application.user_id !== req.userId)
      return res.status(403).json({ message: "You are not allowed to update this application" });

    const updated = await prisma.jobApplication.update({
      where: { app_id: appId },
      data: req.body,
    });

    return res.json({
      message: "Job application updated successfully",
      application: updated,
    });
  } catch (error) {
    console.error("UPDATE JOB APPLICATION ERROR:", error);
    return res.status(500).json({ message: "Failed to update job application" });
  }
};

export const deleteJobApplication = async (req: AuthRequest, res: Response) => {
  const appId = Number(req.params.id);

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { app_id: appId },
    });

    if (!application)
      return res.status(404).json({ message: "Job application not found" });

    if (application.user_id !== req.userId)
      return res.status(403).json({ message: "You are not allowed to delete this application" });

    await prisma.jobApplication.delete({ where: { app_id: appId } });

    return res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    console.error("DELETE JOB APPLICATION ERROR:", error);
    return res.status(500).json({ message: "Failed to delete job application" });
  }
};
