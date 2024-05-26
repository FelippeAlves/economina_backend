import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  whatsapp?: string; // Note que whatsapp é opcional, conforme seu esquema
  password: string;
  confirmPassword?: string; // Novamente, confirmPassword é opcional
  passwordResetCode?: string; // Definindo passwordResetCode como opcional
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  whatsapp: { type: String }, // Você já tinha definido como opcional
  password: { type: String, required: true },
  confirmPassword: { type: String },
  passwordResetCode: { type: String },
});

export default mongoose.model<UserDocument>("User", UserSchema);
