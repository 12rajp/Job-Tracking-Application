import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.userId! },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data: notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch notifications" });
  }
};
