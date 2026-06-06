import { NextResponse } from "next/server";
import { convertFile } from "@/lib/conversionEngine";
import { connectDB } from "@/lib/db";
import { Conversion } from "@/models/Conversion";
import { User } from "@/models/User";
import fs from "fs";
import path from "path";

// Initialize in-memory mock history store for session sandbox
declare global {
  var mockHistories: any[] | undefined;
}

if (!globalThis.mockHistories) {
  globalThis.mockHistories = [];
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const toFormat = formData.get("toFormat") as string;
    const userId = formData.get("userId") as string;
    const qualityStr = formData.get("quality") as string;
    const quality = qualityStr ? parseInt(qualityStr) : 80;
    const watermarkText = (formData.get("watermarkText") as string) || undefined;
    const tool = (formData.get("tool") as string) || undefined;
    const widthStr = formData.get("width") as string;
    const width = widthStr ? parseInt(widthStr) : undefined;
    const heightStr = formData.get("height") as string;
    const height = heightStr ? parseInt(heightStr) : undefined;

    if (!file || !toFormat || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (file, toFormat, userId)" },
        { status: 400 }
      );
    }

    const fromFormat = file.name.split(".").pop()?.toLowerCase() || "";
    const originalSize = file.size;

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Perform conversion
    const { buffer: outputBuffer, fileName, mimeType } = await convertFile(
      inputBuffer,
      file.name,
      fromFormat,
      toFormat,
      { quality, width, height, watermarkText, tool }
    );

    // Ensure output directories exist
    const TEMP_DIR = path.join(process.cwd(), "uploads", "temp");
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Write file to temporary folder
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const outputFileName = `${uniqueId}_${fileName}`;
    const outputPath = path.join(TEMP_DIR, outputFileName);
    fs.writeFileSync(outputPath, outputBuffer);

    const downloadUrl = `/api/convert/download?file=${encodeURIComponent(outputFileName)}`;

    // Try connecting to MongoDB
    const db = await connectDB();
    
    const conversionRecord = {
      userId,
      originalName: file.name,
      originalSize,
      fromFormat,
      toFormat,
      status: "completed" as const,
      originalFileUrl: `/api/convert/download?file=${encodeURIComponent(outputFileName)}`, // using same for demo
      convertedFileUrl: downloadUrl,
      createdAt: new Date(),
    };

    if (db) {
      // Save in MongoDB
      const conv = new Conversion(conversionRecord);
      await conv.save();
      
      // Update User counters
      await User.findOneAndUpdate(
        { _id: userId },
        { 
          $inc: { dailyConversionsCount: 1, storageUsedBytes: originalSize },
          $set: { lastConversionDate: new Date() }
        }
      );
    } else {
      // Save in server-side memory for fallback demo
      globalThis.mockHistories!.push({
        _id: `mock-conv-${uniqueId}`,
        ...conversionRecord,
      });
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName,
      size: outputBuffer.length,
    });
  } catch (error: any) {
    console.error("API Conversion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process conversion." },
      { status: 500 }
    );
  }
}
