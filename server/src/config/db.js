import mongoose from 'mongoose';
import config from './index.js';
import { seedDatabase } from './seed.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    mongoose.set('bufferCommands', false); // Fail fast instead of buffering when disconnected
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    isConnected = true;
    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log('Continuing server startup in database-offline mode...');
  }
};
