import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : "Server Error",
  });
};
