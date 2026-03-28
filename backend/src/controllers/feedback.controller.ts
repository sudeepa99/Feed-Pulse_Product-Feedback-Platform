import { Request, Response } from "express";
import Feedback from "../models/Feedback";
import { analyzeFeedbackWithGemini } from "../services/gemini.service";
import { apiResponse } from "../utils/apiResponse";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } =
      req.body;

    const feedback = await Feedback.create({
      title,
      description,
      category,
      submitterName,
      submitterEmail,
    });

    try {
      const ai = await analyzeFeedbackWithGemini(title, description);

      feedback.ai_category = ai.category;
      feedback.ai_sentiment = ai.sentiment;
      feedback.ai_priority = ai.priority_score;
      feedback.ai_summary = ai.summary;
      feedback.ai_tags = ai.tags;
      feedback.ai_processed = true;
      await feedback.save();
    } catch (aiError) {
      console.error("Gemini failed:", aiError);
    }

    return res
      .status(201)
      .json(apiResponse(true, feedback, "Feedback submitted", null));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to submit feedback", error));
  }
};

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const {
      category,
      status,
      search,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { ai_summary: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const data = await Feedback.find(query)
      .sort({ [String(sortBy)]: order === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Feedback.countDocuments(query);

    return res.status(200).json(
      apiResponse(
        true,
        {
          items: data,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        },
        "Feedback fetched",
        null,
      ),
    );
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch feedback", error));
  }
};

export const getSingleFeedback = async (req: Request, res: Response) => {
  try {
    const item = await Feedback.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Feedback not found", "Not found"));
    }

    return res
      .status(200)
      .json(apiResponse(true, item, "Feedback fetched", null));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch feedback", error));
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const item = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!item) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Feedback not found", "Not found"));
    }

    return res
      .status(200)
      .json(apiResponse(true, item, "Status updated", null));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to update status", error));
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const item = await Feedback.findByIdAndDelete(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Feedback not found", "Not found"));
    }

    return res
      .status(200)
      .json(apiResponse(true, null, "Feedback deleted", null));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to delete feedback", error));
  }
};

export const getSummary = async (_req: Request, res: Response) => {
  try {
    const recent = await Feedback.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).select("title description ai_summary ai_tags");

    const combinedText = recent
      .map((item) => `${item.title} - ${item.ai_summary || item.description}`)
      .join("\n");

    const ai = await analyzeFeedbackWithGemini(
      "Weekly Feedback Summary",
      `Top 3 themes from the last 7 days:\n${combinedText}`,
    );

    return res
      .status(200)
      .json(apiResponse(true, ai, "Summary generated", null));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(false, null, "Failed to generate summary", error));
  }
};
