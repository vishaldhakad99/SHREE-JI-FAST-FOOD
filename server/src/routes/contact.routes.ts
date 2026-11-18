import { Router } from 'express';
import {
  createContactEnquiry,
  getContactEnquiries,
  updateContactStatus,
} from '../controllers/contact.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: customer submits contact inquiry
router.post('/', contactLimiter, createContactEnquiry);

// Admin-only management
router.get('/', authenticateAdmin, getContactEnquiries);
router.patch('/:id', authenticateAdmin, updateContactStatus);

export default router;
