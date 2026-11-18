import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public: website loads restaurant details, hours, delivery availability
router.get('/', getSettings);

// Admin-only: update restaurant profile and configurations
router.put('/', authenticateAdmin, updateSettings);

export default router;
