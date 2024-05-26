import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";
import getUserByToken from "./getUserByToken";

dotenv.config();

export const generateToken = async (user: any, req: Request, res: Response) => {
  const { _id } = user;
  const token = jwt.sign({ _id }, process.env.JWT_SECRET || "HeHchOhMHihNhA", {
    expiresIn: "3h",
  });

  const newUser = await getUserByToken(token);

  return res.status(200).json({
    token,
    user: newUser,
    message: "ok",
  });
};
