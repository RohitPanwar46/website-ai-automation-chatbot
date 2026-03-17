import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  try {
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectDB;