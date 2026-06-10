import mongoose from "mongoose";

async function testConnection() {
  // Option A: Encoded password (since '@' is a special character in URL schema)
  const uriA = "mongodb+srv://lovelycutie031:Balaji%402005@cluster0.uwjxvhq.mongodb.net/?appName=Cluster0";
  // Option B: Plain password without encoding
  const uriB = "mongodb+srv://lovelycutie031:Balaji@2005@cluster0.uwjxvhq.mongodb.net/?appName=Cluster0";
  // Option C: Retaining angle brackets literal
  const uriC = "mongodb+srv://lovelycutie031:%3CBalaji%402005%3E@cluster0.uwjxvhq.mongodb.net/?appName=Cluster0";

  console.log("=== TESTING MONGODB ATLAS CONNECTION CONFIGURATIONS ===");

  try {
    console.log("\nTesting Option A (Encoded password 'Balaji%402005')...");
    await mongoose.connect(uriA, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Option A Connected Successfully!");
    await mongoose.disconnect();
    return;
  } catch (err: any) {
    console.log("❌ Option A failed:", err.message);
  }

  try {
    console.log("\nTesting Option B (Plain password 'Balaji@2005')...");
    await mongoose.connect(uriB, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Option B Connected Successfully!");
    await mongoose.disconnect();
    return;
  } catch (err: any) {
    console.log("❌ Option B failed:", err.message);
  }

  try {
    console.log("\nTesting Option C (Literal angle brackets '<Balaji@2005>')...");
    await mongoose.connect(uriC, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Option C Connected Successfully!");
    await mongoose.disconnect();
    return;
  } catch (err: any) {
    console.log("❌ Option C failed:", err.message);
  }
}

testConnection();
