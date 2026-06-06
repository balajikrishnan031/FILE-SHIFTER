import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  plan: "Free" | "Premium";
  dailyConversionsCount: number;
  lastConversionDate: Date;
  storageUsedBytes: number;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: "" },
  plan: { type: String, enum: ["Free", "Premium"], default: "Free" },
  dailyConversionsCount: { type: Number, default: 0 },
  lastConversionDate: { type: Date, default: Date.now },
  storageUsedBytes: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// Avoid model recompilation errors during Next.js hot-reloads
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
