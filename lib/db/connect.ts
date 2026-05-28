import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global is used here to maintain a cached connection across hot reloads in development
// and across invocations in serverless environments.
let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGO_URI = process.env.MONGO_URI || '';
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (MONGO_URI) {
      console.log('Connecting to MongoDB Atlas...');
      cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
        console.log('MongoDB Connected successfully to Atlas');
        return m;
      });
    } else {
      console.warn('MONGO_URI is missing. Falling back to local MongoDB Memory Server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        console.log(`Fallback MongoMemoryServer URI: ${mongoUri}`);
        cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
          console.log('Fallback MongoDB Memory Server Connected successfully');
          return m;
        });
      } catch (fallbackError: any) {
        console.error(`Fallback MongoMemoryServer Connection Error: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
