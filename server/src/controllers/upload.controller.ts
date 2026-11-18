import { Request, Response, NextFunction } from 'express';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const uploadImageFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!isCloudinaryConfigured) {
      res.status(503).json({
        success: false,
        message: 'Cloudinary credentials are not configured in server environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file to enable cloud image uploads.',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please select an image file to upload.',
      });
      return;
    }

    // Convert buffer to base64 Data URI for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const folder = req.body.folder || 'shreeji-fastfood/food-items';

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 900, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImageFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({ success: false, message: 'publicId is required.' });
      return;
    }

    if (!isCloudinaryConfigured) {
      res.status(503).json({
        success: false,
        message: 'Cloudinary credentials are not configured.',
      });
      return;
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted from Cloudinary successfully.',
    });
  } catch (error) {
    next(error);
  }
};
