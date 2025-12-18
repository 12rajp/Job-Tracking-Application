import "dotenv/config"; 
import express from "express";
import userRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);

app.listen(3000, () =>
console.log("Server running"));
