// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// serve audio/static assets folder (place audio files in server/assets)
const assetsDir = path.resolve(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  console.warn(`[assets] folder not found at ${assetsDir} — create it and place audio files there (e.g. ${assetsDir}\\relaxation-1.mp3)`);
} else {
  console.log(`[assets] serving static files from ${assetsDir}`);
}
app.use('/assets', express.static(assetsDir));

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
const activityRoutes = require('./routes/activityRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const storyRoutes = require('./routes/storyRoutes');
const replyRoutes = require('./routes/replyRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/replies', replyRoutes);

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