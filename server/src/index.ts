import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Shree Ji Fast Food API Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully closing HTTP server...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        try {
          const mongoose = await import('mongoose');
          await mongoose.disconnect();
          console.log('[Database] MongoDB connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Shutdown Error]', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('CRITICAL: Failed to launch server due to database or bootstrap error:', error);
    process.exit(1);
  }
};

startServer();
