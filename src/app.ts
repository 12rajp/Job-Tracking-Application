import "dotenv/config"; 
import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import skillRoutes from "./routes/skill";
import careerPrefRoutes from "./routes/careerPref";
import jobApplicationRoutes from "./routes/jobApplication";
import companyRoutes from "./routes/company"
import statusRoutes from "./routes/status"
import { initMailer } from "./utils/mailer";

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

app.listen(3000, () =>
console.log("Server running"));
