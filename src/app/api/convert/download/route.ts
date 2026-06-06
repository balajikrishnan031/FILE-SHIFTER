import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawFileName = searchParams.get("file");

    if (!rawFileName) {
      return new Response("Missing 'file' parameter", { status: 400 });
    }

    // Security check: Sanitizing path traversal inputs
    const fileName = path.basename(rawFileName);
    const filePath = path.join(process.cwd(), "uploads", "temp", fileName);

    if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine mime-type by extension
    const ext = fileName.split(".").pop()?.toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === "pdf") mimeType = "application/pdf";
    else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext || "")) mimeType = `image/${ext}`;
    else if (ext === "txt") mimeType = "text/plain";
    else if (ext === "zip") mimeType = "application/zip";
    else if (ext === "mp3") mimeType = "audio/mpeg";
    
    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Content-Disposition", `attachment; filename="${fileName.replace(/^\d+_[a-z0-9]+_/, "")}"`);

    return new Response(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download endpoint error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
