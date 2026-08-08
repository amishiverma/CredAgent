import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const options = {
      family: 4,
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`, { host: conn.connection.host });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost.');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection runtime error:', { error: err.message });
    });

  } catch (error) {
    logger.warn(`MongoDB not available on ${process.env.MONGODB_URI}: ${error.message}. Backend running in memory-fallback mode.`);
  }
};

export default connectDB;