import nodemailer from "nodemailer";

export const sendRecoveryEmailPass = async (email: string, code: string) => {
  // Configuração do transporte de e-mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "economina.contato",
      pass: "ebcz yeep ousi jfbw",
    },
  });

  // Corpo do e-mail
  const mailOptions = {
    from: "economina.contato@gmail.com",
    to: email,
    subject: "Código de Verificação para Redefinição de Senha",
    text: `Seu código de verificação é: ${code}`,
  };

  // Enviar e-mail
  await transporter.sendMail(mailOptions);
};
