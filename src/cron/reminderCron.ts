import cron from "node-cron";
import prisma from "../prismaClient/prismaClient";
import { NotificationMethod } from "@prisma/client";

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      reminder_at: { lte: now },
      is_sent: false,
    method: NotificationMethod.INAPP
    },
    include: { user: true },
  });

  for (const r of reminders) {
    await prisma.notification.create({
      data: {
        user_id: r.user_id,
        title: "Reminder",
        message: r.message,
      },
    });

    await prisma.reminder.update({
      where: { rem_id: r.rem_id },
      data: { is_sent: true },
    });
  }
});
