import "dotenv/config"; 
import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import skillRoutes from "./routes/skill";
import careerPrefRoutes from "./routes/careerPref";
import jobApplicationRoutes from "./routes/jobApplication";
import companyRoutes from "./routes/company"
import statusRoutes from "./routes/status"
import contactHRRoutes from "./routes/contactHR";
import { initMailer } from "./utils/mailer";
import reminderRoutes from "./routes/reminder";
import documentRoutes from "./routes/document";
import interviewRoutes from "./routes/interview";

const app = express();

initMailer();
app.use(express.json());
app.use("/users", authRoutes);
app.use("/users", userRoutes);
app.use("/skills", skillRoutes);
app.use("/career-preferences", careerPrefRoutes);
app.use("/job-applications", jobApplicationRoutes);
app.use("/companies", companyRoutes);
app.use("/status", statusRoutes);
app.use("/contact-hr", contactHRRoutes);
app.use("/reminders", reminderRoutes);
app.use("/document",documentRoutes);
app.use("/interview",interviewRoutes);

app.listen(3000, () =>
console.log("Server running"));
