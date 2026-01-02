import mongoose from 'mongoose';
import { Tool } from '../models/tool.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    if (process.env.NODE_ENV !== 'production') {
      await Tool.syncIndexes();
    }
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
