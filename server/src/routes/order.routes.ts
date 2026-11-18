import { Router } from 'express';
import {
  createOrderEnquiry,
  getOrderEnquiries,
  getOrderEnquiryById,
  updateOrderStatus,
  getOrderStats,
  getMyOrders,
} from '../controllers/order.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: customer submits an order enquiry
router.post('/', orderLimiter, createOrderEnquiry);
router.get('/my-orders', getMyOrders);

// Admin-only management routes
router.get('/stats', authenticateAdmin, getOrderStats);
router.get('/', authenticateAdmin, getOrderEnquiries);
router.get('/:id', authenticateAdmin, getOrderEnquiryById);
router.patch('/:id/status', authenticateAdmin, updateOrderStatus);

export default router;
