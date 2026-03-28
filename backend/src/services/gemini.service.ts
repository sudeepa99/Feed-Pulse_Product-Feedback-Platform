import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeFeedbackWithGemini = async (
  title: string,
  description: string,
) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

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
  return JSON.parse(cleaned);
};
