import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/applications";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const uploadApplicationFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF and DOC files allowed!"));
  },
});

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
    doc_id,
  } = req.body;

  const file = req.file;

  if (!company_id || !status_id || !position_title || !job_type || !date_applied) {
    return res.status(400).json({
      message:
        "Required fields are missing: company_id, status_id, position_title, date_applied, job_type",
    });
  }

  try {
    let documentId = doc_id ? Number(doc_id) : null;

    if (file && !documentId) {
      const document = await prisma.document.create({
        data: {
          user_id: userId!,
          doc_name: file.originalname,
          doc_type: "Resume",
          file_path: file.path,
          size: Math.round(file.size / 1024),
        },
      });
      documentId = document.doc_id;
    }

    const jobApplication = await prisma.jobApplication.create({
      data: {
        user_id: userId!,
        company_id: Number(company_id),
        status_id: Number(status_id),
        position_title,
        job_description: job_description || null,
        job_link: job_link || null,
        location: location || null,
        job_type,
        date_applied: new Date(date_applied),
        application_deadline: application_deadline
          ? new Date(application_deadline)
          : null,
        salary_offered: salary_offered
          ? Number(salary_offered)
          : null,
      },
      include: {
        company: true,
        status: true,
      },
    });

    if (documentId) {
      await prisma.document.update({
        where: { doc_id: documentId },
        data: { app_id: jobApplication.app_id },
      });
    }

    return res.status(201).json({
      message: "Job application created successfully",
      data: jobApplication,
    });
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return res
      .status(500)
      .json({ message: "Failed to create job application" });
  }
};

export const getAllJobApplications = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const applications = await prisma.jobApplication.findMany({
      where: { user_id: userId },
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
        status: true,
        documents: true,
        interviews: true,
        reminders: true,
      },
    });

    const total = await prisma.jobApplication.count({
      where: { user_id: userId },
    });

    return res.json({
      data: applications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch job applications" });
  }
};

export const getJobApplicationById = async (
  req: AuthRequest,
  res: Response
) => {
  const appId = Number(req.params.id);
  const userId = req.userId;

  try {
    const application = await prisma.jobApplication.findFirst({
      where: {
        app_id: appId,
        user_id: userId,
      },
      include: {
        company: true,
        status: true,
        documents: true,
        interviews: true,
        reminders: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    return res.json({ data: application });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch job application" });
  }
};

export const updateJobApplication = async (
  req: AuthRequest,
  res: Response
) => {
  const appId = Number(req.params.id);
  const userId = req.userId;

  try {
    const application = await prisma.jobApplication.findFirst({
      where: { app_id: appId, user_id: userId },
    });

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { app_id: appId },
      data: {
        company_id: req.body.company_id
          ? Number(req.body.company_id)
          : application.company_id,
        status_id: req.body.status_id
          ? Number(req.body.status_id)
          : application.status_id,
        position_title:
          req.body.position_title || application.position_title,
        job_description:
          req.body.job_description ?? application.job_description,
        job_link: req.body.job_link ?? application.job_link,
        location: req.body.location ?? application.location,
        job_type: req.body.job_type || application.job_type,
        date_applied: req.body.date_applied
          ? new Date(req.body.date_applied)
          : application.date_applied,
        application_deadline: req.body.application_deadline
          ? new Date(req.body.application_deadline)
          : application.application_deadline,
        salary_offered: req.body.salary_offered
          ? Number(req.body.salary_offered)
          : application.salary_offered,
      },
      include: {
        company: true,
        status: true,
      },
    });

    return res.json({
      message: "Job application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update job application" });
  }
};

export const deleteJobApplication = async (
  req: AuthRequest,
  res: Response
) => {
  const appId = Number(req.params.id);
  const userId = req.userId;

  try {
    const application = await prisma.jobApplication.findFirst({
      where: { app_id: appId, user_id: userId },
    });

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    await prisma.jobApplication.delete({
      where: { app_id: appId },
    });

    return res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete job application" });
  }
};
