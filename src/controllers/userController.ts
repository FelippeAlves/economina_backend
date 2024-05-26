import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod"; // Importe a função 'z' do Zod
import User from "../models/User";
import { generateToken } from "../helpers/generateToken";
import {
  LoginUserSchema,
  changePasswordSchema,
  createUserSchema,
  editUserSchema,
  recoverSchema,
  verifyCodeRecoverSchema,
} from "../models/UserSchemas";
import { getToken } from "../helpers/getToken";
import getUserByToken from "../helpers/getUserByToken";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { sendRecoveryEmailPass } from "../helpers/sendRecoveryEmailPass";

// Define um esquema Zod para validar o corpo da requisição

export const createUser = async (req: Request, res: Response) => {
  try {
    // Valida os dados da requisição com o esquema Zod
    const { email, name, password, whatsapp } = createUserSchema.parse(
      req.body
    );

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Este email já está sendo utilizado." });
    }

    // Criptografa a senha
    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria o novo usuário
    const newUser = new User({
      email,
      name,
      whatsapp: whatsapp || "",
      password: passwordHash,
    });
    await newUser.save();

    // Gera o token JWT
    await generateToken(newUser, req, res);
  } catch (err) {
    // Se a validação falhar, retorna o erro de validação
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  /* return res.status(200).json({ error: "Usuário ou senha inválidos" }); */
  try {
    const { email, password } = LoginUserSchema.parse(req.body);

    // Verifica se o usuário existe
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(422)
        .json({ message: "Email ou senha incorreto, tente novamente." });
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword) {
      return res.status(422).json({
        message: "Email ou senha incorreto, tente novamente.",
      });
    }

    await generateToken(existingUser, req, res);
  } catch (err) {
    // Se a validação falhar, retorna o erro de validação
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const checkUserByToken = async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (!user)
      return res.status(400).json({ message: "Usuário não localizado." });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "Usuário não localizado." });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const token = getToken(req);
  const user = await getUserByToken(token);
  if (!user) return res.status(403).json({ message: "Acesso negado." });
  let newUser: any = {};
  try {
    const { name, password, whatsapp } = editUserSchema.parse(req.body);
    newUser.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      newUser.password = passwordHash;
    }
    if (whatsapp) newUser.whatsapp = whatsapp;
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: newUser },
      { new: true }
    );
    return res.status(200).json({ message: "Dados atualizados com sucesso!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = recoverSchema.parse(req.body);

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Gera e salva o código de verificação
    const verificationCode = generateVerificationCode();
    user.passwordResetCode = verificationCode;
    await user.save();

    // Envia o código de verificação por e-mail
    await sendRecoveryEmailPass(email, verificationCode);
    res
      .status(200)
      .json({ message: "Código de verificação enviado com sucesso." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const verifyRecoverCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = verifyCodeRecoverSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    if (user.passwordResetCode !== code)
      return res.status(402).json({ message: "Código inválido" });
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, password } = changePasswordSchema.parse(req.body);

    // Verifica se o usuário já existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Não foi possível localizar usuário." });
    }
    if (code === user.passwordResetCode) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Define a nova senha e remove o código de redefinição de senha
      user.password = passwordHash;
      user.passwordResetCode = undefined;

      // Salva as alterações no banco de dados
      await user.save();

      res.status(200).json({ message: "Senha redefinida com sucesso." });
    } else {
      res
        .status(402)
        .json({ message: "Código de redefinição de senha inválido." });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const user = await getUserByToken(token);
    if (!user) return res.status(400).json({ ok: false });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).json({ ok: false });
  }
};
