const express = require('express');
const cors = require('cors');
const lockRoutes = require('./routes/lockRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for accurate IP address collection (Vercel)
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development' || !origin) {
      return callback(null, true);
    }

    const corsOrigin = process.env.CORS_ORIGIN || '';
    const allowedList = corsOrigin.split(',').map((item) => item.trim());

    const isAllowed =
      allowedList.includes('*') ||
      allowedList.includes(origin) ||
      (origin && origin.endsWith('.vercel.app'));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS Blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Request Logging (skip OPTIONS)
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.url} (Origin: ${req.headers.origin || 'No Origin'})`
    );
  }
  next();
});

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Remote Lock API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/lock', lockRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;