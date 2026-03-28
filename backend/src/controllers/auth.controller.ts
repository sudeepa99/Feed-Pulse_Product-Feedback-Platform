import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/apiResponse";

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Server env not configured",
          "Missing env values",
        ),
      );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res
      .status(401)
      .json(apiResponse(false, null, "Invalid credentials", "Unauthorized"));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .json(apiResponse(true, { token }, "Login successful", null));
};
