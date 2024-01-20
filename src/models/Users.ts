import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';


export interface User {
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleType: String;
}

export interface UserModel extends User, Document { }

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  roleType: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});



UserSchema.pre<UserModel>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
    next();
  } catch  (error: any) {
    return next(error);
  }
});

export default mongoose.model<UserModel>("Users", UserSchema);
