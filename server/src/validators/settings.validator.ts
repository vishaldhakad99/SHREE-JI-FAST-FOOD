import { z } from 'zod';

export const restaurantSettingsSchema = z.object({
  restaurantName: z.string().trim().min(2).max(100),
  tagline: z.string().trim().max(150),
  logoUrl: z.string().url().optional().or(z.literal('')),
  phoneNumber: z.string().trim().max(50),
  whatsappNumber: z.string().trim().max(50),
  email: z.string().trim().email().optional().or(z.literal('')),
  address: z.string().trim().max(250),
  openingHours: z.string().trim().max(200),
  googleMapsEmbedUrl: z.string().trim().max(1000).optional().or(z.literal('')),
  isDeliveryAvailable: z.boolean(),
  isPickupAvailable: z.boolean(),
  aboutText: z.string().trim().max(2000),
  specialitiesText: z.string().trim().max(1500),
  socialLinks: z.object({
    instagram: z.string().trim().optional(),
    facebook: z.string().trim().optional(),
    youtube: z.string().trim().optional(),
  }).optional(),
  noticeBanner: z.object({
    enabled: z.boolean(),
    text: z.string().trim().max(300),
  }).optional(),
});
