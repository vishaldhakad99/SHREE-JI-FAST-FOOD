import { z } from 'zod';

export const foodItemSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(500),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional(),
  isVegetarian: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  isTodaysSpecial: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  spiceLevel: z.enum(['Mild', 'Medium', 'Spicy']).default('Medium'),
  preparationTimeMinutes: z.coerce.number().min(1).max(120).default(15),
  customizationOptions: z.array(z.string()).optional(),
  sortOrder: z.coerce.number().default(0),
});

export const foodItemUpdateSchema = foodItemSchema.partial();

export const foodCategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(60),
  description: z.string().trim().max(200).optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});
