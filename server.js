require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// Connect to database
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDatabase();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
});