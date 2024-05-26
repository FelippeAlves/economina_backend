import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email é obrigatório" }) // O campo 'email' deve ser uma string de email válida
      .email({ message: "Email inválido" }),
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    whatsapp: z
      .string()
      .max(11, { message: "Whatsapp inválido" })
      .min(11, { message: "Whatsapp inválido" })
      .optional(),
    password: z
      .string()
      .min(6, {
        message: "A senha deve conter no mínimo 6 caracteres",
      })
      .max(14, {
        message: "A senha deve conter no máximo 14 caracteres",
      }), // O campo 'password' deve ter pelo menos 6 caracteres
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha deve ser igual." }), // O campo 'password' deve ter pelo menos 6 caracteres
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
  });

export const LoginUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" }) // O campo 'email' deve ser uma string de email válida
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, {
      message: "A senha deve conter no mínimo 6 caracteres",
    })
    .max(14, {
      message: "A senha deve conter no máximo 14 caracteres",
    }),
});

export const editUserSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    whatsapp: z
      .string()
      .max(11, { message: "Whatsapp inválido" })
      .min(11, { message: "Whatsapp inválido" })
      .optional(),
    password: z
      .string()
      .min(6, {
        message: "A senha deve conter no mínimo 6 caracteres",
      })
      .max(14, {
        message: "A senha deve conter no máximo 14 caracteres",
      })
      .optional(), // O campo 'password' deve ter pelo menos 6 caracteres
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha deve ser igual." })
      .optional(), // O campo 'password' deve ter pelo menos 6 caracteres
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
  });

export const recoverSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" }) // O campo 'email' deve ser uma string de email válida
    .email({ message: "Email inválido" }),
});

export const verifyCodeRecoverSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" }) // O campo 'email' deve ser uma string de email válida
    .email({ message: "Email inválido" }),
  code: z.string().min(6, "Código inválido.").max(6, "Código inválido."),
});

export const changePasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email é obrigatório" }) // O campo 'email' deve ser uma string de email válida
      .email({ message: "Email inválido" }),
    code: z.string().min(6, "Código inválido.").max(6, "Código inválido."),
    password: z
      .string()
      .min(6, {
        message: "A senha deve conter no mínimo 6 caracteres",
      })
      .max(14, {
        message: "A senha deve conter no máximo 14 caracteres",
      }), // O campo 'password' deve ter pelo menos 6 caracteres
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha deve ser igual." }), // O campo 'password' deve ter pelo menos 6 caracteres
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
  });
