import { Router } from "express";
import {
  createFeedback,
  getAllFeedback,
  getSingleFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getSummary,
} from "../controllers/feedback.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createFeedback);
router.get("/summary", protect, getSummary);
router.get("/", protect, getAllFeedback);
router.get("/:id", protect, getSingleFeedback);
router.patch("/:id", protect, updateFeedbackStatus);
router.delete("/:id", protect, deleteFeedback);

export default router;
