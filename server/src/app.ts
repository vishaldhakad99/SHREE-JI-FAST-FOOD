import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import dailyMenuRoutes from './routes/dailyMenu.routes.js';
import orderRoutes from './routes/order.routes.js';
import contactRoutes from './routes/contact.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';

export const createApp = (): Application => {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    })
  );

  // 2. CORS Configuration
  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          // If on Render or production custom domain
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body & Cookie Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // 4. Global Rate Limiter
  app.use('/api', globalLimiter);

  // 5. Health Check Endpoint (Required in Section 13)
  app.get('/api/health', (_req: Request, res: Response) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    res.status(isDbConnected ? 200 : 503).json({
      status: isDbConnected ? 'healthy' : 'degraded',
      service: 'Shree Ji Fast Food API',
      timestamp: new Date().toISOString(),
      database: {
        status: states[mongoose.connection.readyState] || 'unknown',
        connected: isDbConnected,
      },
      uptime: process.uptime(),
    });
  });

  // 6. API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/food', foodRoutes);
  app.use('/api/daily-menu', dailyMenuRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);

  // 7. Not Found and Centralized Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
