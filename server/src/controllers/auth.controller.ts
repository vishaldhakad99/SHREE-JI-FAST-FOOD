import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

const generateToken = (id: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_min_32_chars';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, email, role }, secret, { expiresIn: expiresIn as any });
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'This administrator account is disabled.',
      });
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id.toString(), admin.email, admin.role);

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token, // Also return in body for header-based auth support
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const admin = await Admin.findById(req.admin.id).select('+passwordHash');
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password does not match.' });
      return;
    }

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
