import { Router } from 'express';
import {
  sendCustomerOtp,
  verifyCustomerOtp,
  getCustomerMe,
  customerLogout,
} from '../controllers/customerAuth.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/send-otp', authLimiter, sendCustomerOtp);
router.post('/verify-otp', authLimiter, verifyCustomerOtp);
router.get('/me', getCustomerMe);
router.post('/logout', customerLogout);

export default router;
