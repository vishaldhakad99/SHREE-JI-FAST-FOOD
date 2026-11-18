import { Router } from 'express';
import {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getCategories,
  createCategory,
} from '../controllers/food.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getFoodItems);
router.get('/categories', getCategories);
router.get('/:id', getFoodItemById);

// Admin-only routes
router.post('/categories', authenticateAdmin, createCategory);
router.post('/', authenticateAdmin, createFoodItem);
router.put('/:id', authenticateAdmin, updateFoodItem);
router.delete('/:id', authenticateAdmin, deleteFoodItem);

export default router;
