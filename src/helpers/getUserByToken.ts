import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const getUserByToken = async (token: string) => {
  if (!token) {
    throw new Error("Token não fornecido");
  }
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "HeHchOhMHihNhA"
    );
    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Token inválido");
  }
};

export default getUserByToken;
