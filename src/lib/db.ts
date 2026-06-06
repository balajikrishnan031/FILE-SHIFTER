import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add types for global mongoose variable
declare global {
  var mongooseConnection: GlobalMongoose | undefined;
}

let cached = (globalThis.mongooseConnection || { conn: null, promise: null }) as GlobalMongoose;
globalThis.mongooseConnection = cached;

export async function connectDB() {
  if (!MONGODB_URI) {
    // If no DB is specified, we log a warning but don't crash.
    // The APIs will check this and fall back to in-memory operations.
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Warning: MONGODB_URI is not defined. Shifter is running in Sandbox Mock DB Mode.");
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("🔌 Connected to MongoDB successfully.");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e);
    return null;
  }

  return cached.conn;
}
