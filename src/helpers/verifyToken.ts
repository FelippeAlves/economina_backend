import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "./getToken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Acesso negado.",
    });
  }
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Acesso negado.",
    });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "HeHchOhMHihNhA"
    );
    if (!verified) return res.status(403).json({ message: "Acesso negado." });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Acesso negado.",
    });
  }
};
