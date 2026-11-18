import { Router } from 'express';
import { uploadImageFile, deleteImageFile } from '../controllers/upload.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

// Admin-only image upload & delete
router.post('/', authenticateAdmin, uploadImage.single('image'), uploadImageFile);
router.delete('/', authenticateAdmin, deleteImageFile);

export default router;
