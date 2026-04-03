import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // use working model
  });
};

export const analyzeFeedbackWithGemini = async (
  title: string,
  description: string,
) => {
  const model = getModel();

  const prompt = `
Analyse this product feedback. Return ONLY valid JSON with these fields:
category, sentiment, priority_score, summary, tags.

Allowed category: Bug | Feature Request | Improvement | Other
Allowed sentiment: Positive | Neutral | Negative
priority_score must be a number from 1 to 10
tags must be an array of strings

Feedback title: ${title}
Feedback description: ${description}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Invalid JSON from Gemini:", cleaned);
    return {
      category: "Other",
      sentiment: "Neutral",
      priority_score: 5,
      summary: "Failed to parse AI response",
      tags: [],
    };
  }
};

export const generateWeeklySummaryWithGemini = async (feedbackText: string) => {
  const model = getModel();

  const prompt = `
You are analyzing product feedback from the last 7 days.

Return ONLY valid JSON with this exact shape:
{
  "summary": "short summary paragraph",
  "top_themes": ["theme 1", "theme 2", "theme 3"]
}

Feedback:
${feedbackText}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Invalid summary JSON:", cleaned);
    return {
      summary: "AI summary parsing failed.",
      top_themes: [],
    };
  }
};
