import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./db/conn";
import apiRoutes from "./routes/apiRoutes";
import userRoutes from "./routes/userRoutes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Conectar ao banco de dados
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*", // ou origin: "http://seusite.com"
  })
);
// Rotas da API
app.use("/api", apiRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo a api do economina!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
