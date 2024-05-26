import express, { Request, Response } from "express";
import { validateToken } from "../controllers/userController";
import { verifyToken } from "../helpers/verifyToken";

const router = express.Router();

router.get("/v1", (req: Request, res: Response) => {
  res.send("API v1 está funcionando!");
});

router.post("/v1/token", verifyToken, validateToken);

export default router;
