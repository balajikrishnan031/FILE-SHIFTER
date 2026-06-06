import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { id, name, email, avatar, role, plan } = await req.json();
    if (!id || !name || !email) {
      return NextResponse.json({ success: false, error: "Missing required user fields" }, { status: 400 });
    }

    const db = await connectDB();
    if (db) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { 
          $set: { 
            name, 
            email, 
            avatar, 
            role: role || "user", 
            plan: plan || "Free" 
          } 
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, user: updatedUser });
    }
    
    return NextResponse.json({ success: true, message: "Sandbox Mock Mode" });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
