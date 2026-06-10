// Configure environment variable before importing DB connection
process.env.MONGODB_URI = "mongodb+srv://lovelycutie031:Balaji%402005@cluster0.uwjxvhq.mongodb.net/shifter?retryWrites=true&w=majority";

import { connectDB } from "./db";
import { convertFile } from "./conversionEngine";
import { Conversion } from "../models/Conversion";
import { User } from "../models/User";
import mongoose from "mongoose";

async function runLiveDbTest() {
  console.log("=== SHIFTER LIVE DATABASE INTEGRITY TEST ===");
  console.log("Connecting to MongoDB Atlas Cluster...");

  const db = await connectDB();
  if (!db) {
    console.error("❌ Failed to connect to live MongoDB Atlas database!");
    process.exit(1);
  }

  console.log("✅ Connected to MongoDB Atlas successfully!");

  try {
    const testUserId = "live-test-user-balaji";
    
    // 1. Sync User in Atlas
    console.log(`\nSyncing test user '${testUserId}' in User collection...`);
    let user = await User.findById(testUserId);
    if (!user) {
      user = new User({
        _id: testUserId,
        email: "balaji.test@shifter.app",
        name: "Balaji Test User",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
        role: "user",
        dailyConversionsCount: 0,
        storageUsedBytes: 0,
      });
      await user.save();
      console.log("✅ Created new test user profile in database!");
    } else {
      console.log("✅ Test user profile already exists.");
    }

    // 2. Perform mock conversion (TXT to PDF)
    console.log("\nExecuting file conversion (TXT to PDF)...");
    const testText = "Live database check: Shifter universal converter is working successfully in cloud production.";
    const txtBuffer = Buffer.from(testText);
    const convResult = await convertFile(txtBuffer, "test_live_db.txt", "txt", "pdf");
    console.log("✅ Conversion complete! Output size:", convResult.buffer.length, "bytes");

    // 3. Save Conversion history in Atlas
    console.log("\nSaving conversion record to Conversions collection...");
    const record = new Conversion({
      userId: testUserId,
      originalName: "test_live_db.txt",
      originalSize: txtBuffer.length,
      fromFormat: "txt",
      toFormat: "pdf",
      status: "completed",
      originalFileUrl: `/api/convert/download?file=test_live_db.txt`,
      convertedFileUrl: `/api/convert/download?file=${convResult.fileName}`,
      createdAt: new Date(),
    });
    const savedRecord = await record.save();
    console.log("✅ Conversion record saved in MongoDB Atlas! Record ID:", savedRecord._id);

    // 4. Update User stats
    console.log("\nUpdating user conversion count in Atlas...");
    await User.findByIdAndUpdate(testUserId, {
      $inc: { dailyConversionsCount: 1, storageUsedBytes: txtBuffer.length },
      $set: { lastConversionDate: new Date() }
    });
    console.log("✅ User stats updated!");

    // 5. Query Atlas database to verify document retrieval
    console.log("\nQuerying database to check retrieval of saved record...");
    const retrievedRecord = await Conversion.findById(savedRecord._id);
    if (retrievedRecord) {
      console.log("🎉 SUCCESS! Retrieved Record from MongoDB Atlas:");
      console.log("-----------------------------------------");
      console.log("ID:", retrievedRecord._id);
      console.log("Original Name:", retrievedRecord.originalName);
      console.log("Format:", retrievedRecord.fromFormat, "->", retrievedRecord.toFormat);
      console.log("Saved at:", retrievedRecord.createdAt);
      console.log("-----------------------------------------");
    } else {
      console.error("❌ Failed to retrieve the saved record from MongoDB.");
    }

  } catch (err: any) {
    console.error("❌ Database operation failed:", err.message);
  } finally {
    console.log("\nDisconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("=== LIVE DATABASE INTEGRITY TEST COMPLETE ===");
  }
}

runLiveDbTest();
