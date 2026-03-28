import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import feedbackRoutes from "./routes/feedback.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "FeedPulse API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use(errorHandler);

export default app;
