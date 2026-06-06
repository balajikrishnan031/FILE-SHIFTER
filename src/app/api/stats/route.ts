import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Conversion } from "@/models/Conversion";
import { User } from "@/models/User";

export async function GET() {
  try {
    const db = await connectDB();
    
    let totalConversions = 384; // Seeded baseline
    let totalUsers = 112; // Seeded baseline
    let activeUsers = 48; // Seeded baseline
    let recentConversions: any[] = [];
    
    // Seeded data for chart visuals
    const formatStats = [
      { name: "PDF to DOCX", value: 124 },
      { name: "JPG to PNG", value: 98 },
      { name: "PNG to WEBP", value: 82 },
      { name: "MP4 to MP3", value: 54 },
      { name: "TXT to PDF", value: 26 },
    ];

    const dailyTrends = [
      { date: "May 28", conversions: 45 },
      { date: "May 29", conversions: 52 },
      { date: "May 30", conversions: 49 },
      { date: "May 31", conversions: 63 },
      { date: "Jun 01", conversions: 58 },
      { date: "Jun 02", conversions: 72 },
      { date: "Jun 03", conversions: 84 },
    ];

    const monthlyTrends = [
      { month: "Jan", revenue: 240, conversions: 1200 },
      { month: "Feb", revenue: 380, conversions: 1540 },
      { month: "Mar", revenue: 510, conversions: 1890 },
      { month: "Apr", revenue: 760, conversions: 2400 },
      { month: "May", revenue: 990, conversions: 3100 },
      { month: "Jun", revenue: 1240, conversions: 3800 },
    ];

    if (db) {
      const realCount = await Conversion.countDocuments();
      totalConversions += realCount;
      
      const realUsers = await User.countDocuments();
      totalUsers += realUsers;
      
      recentConversions = await Conversion.find().sort({ createdAt: -1 }).limit(5);
    } else {
      const mockList = globalThis.mockHistories || [];
      totalConversions += mockList.length;
      recentConversions = mockList.slice(0, 5);
      
      // Calculate dynamic formatting stats from live mock conversions
      mockList.forEach((record) => {
        const formatPair = `${record.fromFormat.toUpperCase()} to ${record.toFormat.toUpperCase()}`;
        const found = formatStats.find((f) => f.name === formatPair);
        if (found) {
          found.value += 1;
        } else {
          formatStats.push({ name: formatPair, value: 1 });
        }
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalConversions,
        totalUsers,
        activeUsers,
        formatStats: formatStats.sort((a, b) => b.value - a.value).slice(0, 5),
        dailyTrends,
        monthlyTrends,
        recentConversions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
