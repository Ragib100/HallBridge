import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

const MONGO_URI: string = MONGODB_URI;

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

// MongoDB connection options for optimal performance
const mongooseOptions: mongoose.ConnectOptions = {
  // Connection pool settings
  maxPoolSize: 10, // Maximum connections in pool
  minPoolSize: 2, // Minimum connections to maintain
  
  // Timeout settings
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 10000, // Connection timeout
  
  // Buffer settings
  bufferCommands: true, // Buffer commands when disconnected
  
  // Write concern for durability
  writeConcern: {
    w: 'majority',
    wtimeout: 2500,
  },
  
  // Read preference for faster reads
  readPreference: 'primaryPreferred',
  
  // Auto index (disable in production for faster startup)
  autoIndex: process.env.NODE_ENV !== 'production',
};

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, mongooseOptions);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
