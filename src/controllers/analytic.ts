import { Response } from "express";
import prisma from "../prismaClient/prismaClient";
import { AuthRequest } from "../interfaces/authRequest.interface";

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const analytics = await prisma.status.findMany({
      select: {
        status_id: true,
        status_name: true,
        _count: {
          select: {
            jobApplications: {
              where: {
                user_id: userId,
              },
            },
          },
        },
      },
      orderBy: {
        status_id: "asc",
      },
    });

    const formatted = analytics.map(item => ({
      status_id: item.status_id,
      status_name: item.status_name,
      total: item._count.jobApplications,
    }));

    res.json({ data: formatted });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
