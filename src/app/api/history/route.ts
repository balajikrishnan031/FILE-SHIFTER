import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Conversion } from "@/models/Conversion";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing 'userId'" }, { status: 400 });
    }

    const db = await connectDB();
    let records = [];

    if (db) {
      records = await Conversion.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Fetch from in-memory fallback list, filtered by userId
      records = (globalThis.mockHistories || [])
        .filter((item) => item.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing 'userId'" }, { status: 400 });
    }

    const db = await connectDB();

    if (db) {
      await Conversion.deleteMany({ userId });
    } else {
      // Clear in-memory fallback
      globalThis.mockHistories = globalThis.mockHistories!.filter(
        (item) => item.userId !== userId
      );
    }

    return NextResponse.json({ success: true, message: "History cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
