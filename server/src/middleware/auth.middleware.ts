import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AdminPayload } from '../types/index.js';
import { Admin } from '../models/Admin.js';

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.admin_token;

    // Also support Authorization: Bearer <token> header for convenience/APIs
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Security] JWT_SECRET is not configured on the server');
      res.status(500).json({
        success: false,
        message: 'Authentication service configuration error.',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as AdminPayload;

    const admin = await Admin.findById(decoded.id).select('+isActive');
    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Admin account is no longer active or was not found.',
      });
      return;
    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Session has expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }
};
