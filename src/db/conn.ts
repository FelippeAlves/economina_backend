import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const MONGO_USER = process.env.DB_USER;
    const MONGO_PASS = process.env.DB_PASS;
    const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.qixwgc0.mongodb.net/`;

    await mongoose.connect(MONGO_URI);

    console.log("Conectado ao MongoDB");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
