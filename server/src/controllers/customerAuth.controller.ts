import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer';
import { OtpSession } from '../models/OtpSession';
import { generateOtp, sendEmailOtp, sendSmsOtp } from '../services/otpService';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[Security] JWT_SECRET is not configured on the server');
    }
    return 'fallback_customer_secret_shreeji_2026';
  }
  return secret;
};

export const sendCustomerOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, identifier, name } = req.body;

    if (!type || !['phone', 'email'].includes(type)) {
      res.status(400).json({ success: false, message: 'Type must be phone or email' });
      return;
    }

    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ success: false, message: 'Identifier (phone or email) is required' });
      return;
    }

    let cleanIdentifier = identifier.trim().toLowerCase();

    if (type === 'phone') {
      const numericPhone = cleanIdentifier.replace(/\D/g, '');
      const validPhone = numericPhone.length === 12 && numericPhone.startsWith('91')
        ? numericPhone.substring(2)
        : numericPhone;

      // 1. Strict Indian Mobile check: must start with 6, 7, 8, 9 and be 10 digits
      if (!/^[6-9]\d{9}$/.test(validPhone)) {
        res.status(400).json({
          success: false,
          message: 'Galat mobile number! Kripya apna sahi 10-digit Indian mobile number (6, 7, 8, ya 9 se shuru) dalein.',
        });
        return;
      }

      // 2. Reject fake repetitive digits (e.g. 0000000000, 9999999999, 1234567890)
      const allSame = /^(\d)\1{9}$/.test(validPhone);
      const isFakeSequential = validPhone === '1234567890' || validPhone === '9876543210';
      if (allSame || isFakeSequential) {
        res.status(400).json({
          success: false,
          message: 'Yeh invalid/fake mobile number hai! Kripya apna asli active mobile number dalein.',
        });
        return;
      }

      cleanIdentifier = validPhone;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanIdentifier)) {
        res.status(400).json({
          success: false,
          message: 'Please enter a valid email address',
        });
        return;
      }
    }

    // Delete existing pending OTPs for this identifier
    await OtpSession.deleteMany({ identifier: cleanIdentifier });

    // Generate new 6-digit OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await OtpSession.create({
      identifier: cleanIdentifier,
      type,
      otp,
      customerName: name ? String(name).trim() : undefined,
      expiresAt,
      verified: false,
    });

    let sendResult;
    if (type === 'email') {
      sendResult = await sendEmailOtp(cleanIdentifier, otp, name);
    } else {
      sendResult = await sendSmsOtp(cleanIdentifier, otp);
    }

    if (!sendResult.success) {
      res.status(400).json({
        success: false,
        message: sendResult.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: sendResult.message || (type === 'email' ? 'Verification code sent to your Gmail inbox' : 'OTP sent to your mobile number via SMS'),
      type,
      identifier: cleanIdentifier,
    });
  } catch (error: any) {
    console.error('Error in sendCustomerOtp:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code. Please try again.' });
  }
};

export const verifyCustomerOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, name } = req.body;

    if (!identifier || !otp) {
      res.status(400).json({ success: false, message: 'Identifier and OTP code are required' });
      return;
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Find active OTP session
    const otpSession = await OtpSession.findOne({
      identifier: cleanIdentifier,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpSession) {
      res.status(400).json({
        success: false,
        message: 'Verification code has expired or is invalid. Please request a new code.',
      });
      return;
    }

    if (otpSession.otp !== cleanOtp) {
      res.status(400).json({
        success: false,
        message: 'Incorrect verification code. Please check and try again.',
      });
      return;
    }

    // Mark as verified
    otpSession.verified = true;
    await otpSession.save();

    // Find or create customer
    let customer;
    const finalName = (name && String(name).trim()) || otpSession.customerName || 'Valued Customer';

    if (otpSession.type === 'phone') {
      customer = await Customer.findOne({ phone: cleanIdentifier });
      if (!customer) {
        customer = await Customer.create({
          name: finalName,
          phone: cleanIdentifier,
          authMethod: 'phone',
          isVerified: true,
          lastLogin: new Date(),
        });
      } else {
        if (name && String(name).trim()) {
          customer.name = String(name).trim();
        }
        customer.lastLogin = new Date();
        await customer.save();
      }
    } else {
      customer = await Customer.findOne({ email: cleanIdentifier });
      if (!customer) {
        customer = await Customer.create({
          name: finalName,
          email: cleanIdentifier,
          authMethod: 'email',
          isVerified: true,
          lastLogin: new Date(),
        });
      } else {
        if (name && String(name).trim()) {
          customer.name = String(name).trim();
        }
        customer.lastLogin = new Date();
        await customer.save();
      }
    }

    // Sign Permanent Customer JWT Token (10 years)
    const secret = getJwtSecret();
    const token = jwt.sign(
      {
        customerId: customer._id.toString(),
        role: 'customer',
        name: customer.name,
      },
      secret,
      { expiresIn: '3650d' } as any
    );

    res.cookie('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3650 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        authMethod: customer.authMethod,
      },
    });
  } catch (error: any) {
    console.error('Error in verifyCustomerOtp:', error);
    res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
};

export const getCustomerMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token =
      req.cookies?.customer_token ||
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;

    if (!decoded || !decoded.customerId || decoded.role !== 'customer') {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }

    const customer = await Customer.findById(decoded.customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer account not found' });
      return;
    }

    res.status(200).json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        authMethod: customer.authMethod,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired, please login again' });
  }
};

export const customerLogout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('customer_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Customer logged out successfully' });
};
