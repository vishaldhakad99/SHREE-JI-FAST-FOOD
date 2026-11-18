import { z } from 'zod';

export const dailyMenuItemValidator = z.object({
  foodItem: z.string().optional(),
  name: z.string().trim().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().trim().optional(),
  category: z.string().trim().default('Daily Special'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  isAvailable: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const dailyMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  title: z.string().trim().min(3).max(100).default("Today's Fresh Daily Specials"),
  specialAnnouncement: z.string().trim().max(500).optional(),
  items: z.array(dailyMenuItemValidator).min(1, 'Please add at least one dish to the daily menu'),
  isActive: z.boolean().default(true),
});

export const dailyMenuUpdateSchema = dailyMenuSchema.partial();
