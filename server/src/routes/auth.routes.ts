import { Router } from 'express';
import { login, logout, getMe, changePassword } from '../controllers/auth.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);
router.post('/change-password', authenticateAdmin, changePassword);

export default router;
