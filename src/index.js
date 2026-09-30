require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

let cachedDb = null;

// Connect to database for serverless (Vercel)
const connectDatabase = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedDb = conn;
    console.log('MongoDB Connected (Serverless)');
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Initialize database connection
connectDatabase();

// Export Express app directly for Vercel
module.exports = app;