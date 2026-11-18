import { Router } from 'express';
import {
  getTodayMenu,
  listMenus,
  createOrUpdateDailyMenu,
  updateDailyMenuById,
  deleteDailyMenu,
} from '../controllers/dailyMenu.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public route: customer site queries today's menu
router.get('/', getTodayMenu);

// Admin-only routes
router.get('/list', authenticateAdmin, listMenus);
router.post('/', authenticateAdmin, createOrUpdateDailyMenu);
router.put('/:id', authenticateAdmin, updateDailyMenuById);
router.delete('/:id', authenticateAdmin, deleteDailyMenu);

export default router;
