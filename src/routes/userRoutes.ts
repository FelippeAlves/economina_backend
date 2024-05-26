import express from "express";
import {
  createUser,
  userLogin,
  checkUserByToken,
  editUser,
  requestPasswordReset,
  verifyRecoverCode,
  resetPassword,
} from "../controllers/userController";
import { verifyToken } from "../helpers/verifyToken";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", userLogin);
router.post("/recover", requestPasswordReset);
router.post("/code", verifyRecoverCode);
router.post("/changepassword", resetPassword);
router.get("/checkuser", verifyToken, checkUserByToken);
router.patch("/edit", verifyToken, editUser);

export default router;
