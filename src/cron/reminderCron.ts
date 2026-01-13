import cron from "node-cron";
import prisma from "../prismaClient/prismaClient";
import { sendReminderEmail } from "../utils/mailer";

cron.schedule("* * * * *", async () => {
  console.log("Checking for pending reminders...");

  try {
    const now = new Date();
    
    const pendingReminders = await prisma.reminder.findMany({
      where: {
        is_sent: false,
        reminder_at: {
          lte: now,
        },
      },
      include: {
        user: true,
        application: {
          include: {
            company: true,
          },
        },
      },
    });

    console.log(`Found ${pendingReminders.length} pending reminders`);

    for (const reminder of pendingReminders) {
      try {
        const emailSubject = `Reminder: ${reminder.application.position_title} at ${reminder.application.company.company_name}`;
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Job Application Reminder</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Position:</strong> ${reminder.application.position_title}</p>
              <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${reminder.application.company.company_name}</p>
              ${reminder.message ? `<p style="margin: 0;"><strong>Note:</strong> ${reminder.message}</p>` : ''}
            </div>
            <p style="color: #6b7280;">This is an automated reminder for your job application.</p>
          </div>
        `;

        await sendReminderEmail(
          reminder.user.email,
          emailSubject,
          emailHtml
        );

        await prisma.reminder.update({
          where: { rem_id: reminder.rem_id },
          data: { is_sent: true },
        });

        await prisma.notification.create({
          data: {
            user_id: reminder.user_id,
            title: "Reminder Sent",
            message: `Reminder for ${reminder.application.position_title} at ${reminder.application.company.company_name}`,
            is_read: false,
          },
        });

        console.log(`Reminder ${reminder.rem_id} sent successfully to ${reminder.user.email}`);
      } catch (error) {
        console.error(`Failed to send reminder ${reminder.rem_id}:`, error);
    
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

console.log("Reminder cron job initialized ");
