import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { getPagination } from "../utils/pagination ";

export const getAllReminders = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { take, skip } = getPagination(page, limit);

  try {
    const reminders = await prisma.reminder.findMany({
      where: { user_id: userId },
      take,
      skip,
      orderBy: { reminder_at: "asc" },
     include: {
  application: {     
    include: {
      company: true,
    },
  },
  user: true,
}
    });

    const total = await prisma.reminder.count({
      where: { user_id: userId },
    });

    return res.json({
      data: reminders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET REMINDERS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

export const addReminder = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { app_id, reminder_at, message } = req.body;

  if (!app_id || !reminder_at) {
    return res.status(400).json({
      message: "app_id and reminder_at are required",
    });
  }

  try {
    const reminder = await prisma.reminder.create({
      data: {
        user_id: userId!,
        app_id: Number(app_id),
        reminder_at: new Date(reminder_at),
        message: message || "",
        method: "INAPP", 
      },
    });

    return res.status(201).json({
      message: "Reminder added successfully",
      reminder,
    });
  } catch (error) {
    console.error("ADD REMINDER ERROR:", error);
    return res.status(500).json({ message: "Failed to add reminder" });
  }
};

export const getReminderById = async (req: AuthRequest, res: Response) => {
  const reminderId = Number(req.params.id);

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { rem_id: reminderId },
      include: {
  application: {
    include: {
      company: true,
    },
  },
  user: true,
}
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user_id !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    return res.json({ reminder });
  } catch (error) {
    console.error("GET REMINDER ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch reminder" });
  }
};

export const updateReminder = async (req: AuthRequest, res: Response) => {
  const reminderId = Number(req.params.id);
  const { reminder_at, message, method, is_sent } = req.body;

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { rem_id: reminderId },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user_id !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { rem_id: reminderId },
      data: {
        reminder_at: reminder_at ? new Date(reminder_at) : undefined,
        message,
        method,
        is_sent,
      },
    });

    return res.json({
      message: "Reminder updated successfully",
      reminder: updatedReminder,
    });
  } catch (error) {
    console.error("UPDATE REMINDER ERROR:", error);
    return res.status(500).json({ message: "Failed to update reminder" });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
  const reminderId = Number(req.params.id);

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { rem_id: reminderId },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user_id !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await prisma.reminder.delete({
      where: { rem_id: reminderId },
    });

    return res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("DELETE REMINDER ERROR:", error);
    return res.status(500).json({ message: "Failed to delete reminder" });
  }
};
