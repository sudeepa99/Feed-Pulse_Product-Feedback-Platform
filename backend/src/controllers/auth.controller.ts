import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/apiResponse";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res
      .status(401)
      .json(apiResponse(false, null, "Invalid credentials", "Unauthorized"));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || "", {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .json(apiResponse(true, { token }, "Login successful", null));
};
