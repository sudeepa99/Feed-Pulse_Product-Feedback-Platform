import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  createFeedback,
  getAllFeedback,
  getSingleFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getSummary,
  reanalyzeFeedback,
  getFeedbackStats,
} from "../controllers/feedback.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

const feedbackSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    data: null,
    message:
      "Too many feedback submissions from this IP. Please try again later.",
    error: "Rate limit exceeded",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

console.log("Rate limiter type:", typeof feedbackSubmissionLimiter);
console.log("Create feedback type:", typeof createFeedback);

router.post("/", feedbackSubmissionLimiter, createFeedback);

router.get("/summary", protect, getSummary);
router.get("/stats", protect, getFeedbackStats);
router.get("/", protect, getAllFeedback);
router.get("/:id", protect, getSingleFeedback);

router.patch("/:id", protect, updateFeedbackStatus);
router.delete("/:id", protect, deleteFeedback);
router.post("/:id/reanalyze", protect, reanalyzeFeedback);

export default router;
