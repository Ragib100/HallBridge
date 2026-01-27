/**
 * Database Connection Helper for Scripts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB(): Promise<boolean> {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local");
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    return false;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
}

export { MONGODB_URI };
