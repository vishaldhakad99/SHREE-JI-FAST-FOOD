import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique field like email or slug)
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `A record with this ${duplicateField} already exists.`;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format.';
  }

  // Handle JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Authorization failed.';
  }

  if (statusCode === 500) {
    console.error('[ServerError]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
};
