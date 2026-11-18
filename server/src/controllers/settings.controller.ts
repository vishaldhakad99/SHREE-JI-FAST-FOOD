import { Request, Response, NextFunction } from 'express';
import { RestaurantSettings } from '../models/RestaurantSettings.js';
import { restaurantSettingsSchema } from '../validators/settings.validator.js';

export const getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = restaurantSettingsSchema.parse(req.body);

    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create(data);
    } else {
      settings.restaurantName = data.restaurantName;
      settings.tagline = data.tagline;
      if (data.logoUrl !== undefined) settings.logoUrl = data.logoUrl;
      settings.phoneNumber = data.phoneNumber;
      settings.whatsappNumber = data.whatsappNumber;
      if (data.email !== undefined) settings.email = data.email;
      settings.address = data.address;
      settings.openingHours = data.openingHours;
      if (data.googleMapsEmbedUrl !== undefined) settings.googleMapsEmbedUrl = data.googleMapsEmbedUrl;
      settings.isDeliveryAvailable = data.isDeliveryAvailable;
      settings.isPickupAvailable = data.isPickupAvailable;
      settings.aboutText = data.aboutText;
      settings.specialitiesText = data.specialitiesText;
      if (data.socialLinks) settings.socialLinks = data.socialLinks;
      if (data.noticeBanner) settings.noticeBanner = data.noticeBanner;

      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant settings updated successfully.',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
