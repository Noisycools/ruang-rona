// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware
// Enable tighter CORS in production, permissive for local development
if (process.env.NODE_ENV === 'development') {
  const devOrigins = [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173', // vite default
    'http://localhost:3000', // CRA / other dev servers
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // allow non-browser requests (e.g. Postman) with no origin
      if (!origin) return callback(null, true);
      if (devOrigins.includes(origin)) return callback(null, true);
      // default deny
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
} else {
  // production - keep default (restrict or set CLIENT_ORIGIN env)
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || false,
    credentials: true,
  }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Ruang Rona API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const storyRoutes = require('./routes/storyRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/exercises', exerciseRoutes);
// app.use('/api/stories', storyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;