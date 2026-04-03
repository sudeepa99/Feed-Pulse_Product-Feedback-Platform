import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 4000;
console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY);

console.log("KEY VALUE:", process.env.GEMINI_API_KEY?.slice(0, 10));

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

start();
