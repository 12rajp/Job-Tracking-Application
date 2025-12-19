import "dotenv/config"; 
import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { initMailer } from "./utils/mailer";
const app = express();

initMailer();
app.use(express.json());
app.use("/users", authRoutes);
app.use("/users", userRoutes);

app.listen(3000, () =>
console.log("Server running"));
