import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Server running`);
});
 