import mongoose from 'mongoose';

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const errorMsg = 'CRITICAL CONFIGURATION ERROR: MONGODB_URI is not defined in environment variables. Real database connection is mandatory.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB runtime connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB connection lost.');
    });

    return conn;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
};
