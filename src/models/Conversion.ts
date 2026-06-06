import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversion extends Document {
  userId: string;
  originalName: string;
  originalSize: number;
  fromFormat: string;
  toFormat: string;
  status: "pending" | "processing" | "completed" | "failed";
  originalFileUrl?: string;
  convertedFileUrl?: string;
  createdAt: Date;
}

const ConversionSchema = new Schema<IConversion>({
  userId: { type: String, required: true },
  originalName: { type: String, required: true },
  originalSize: { type: Number, required: true },
  fromFormat: { type: String, required: true },
  toFormat: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed"], 
    default: "pending" 
  },
  originalFileUrl: { type: String },
  convertedFileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Conversion: Model<IConversion> = 
  mongoose.models.Conversion || mongoose.model<IConversion>("Conversion", ConversionSchema);
