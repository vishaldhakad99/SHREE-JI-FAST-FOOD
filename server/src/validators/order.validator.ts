import { z } from 'zod';

export const orderEnquirySchema = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  customerPhone: z.string().trim().min(10, 'Please enter a valid 10-digit mobile number').max(15)
    .regex(/^[0-9+ \-()]+$/, 'Phone number must contain valid digits'),
  foodItemId: z.string().optional(),
  foodItemName: z.string().trim().min(2, 'Requested dish or meal is required').max(120),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').max(100),
  deliveryType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().trim().max(300).optional(),
  additionalRequirements: z.string().trim().max(1000).optional(),
  source: z.enum(['website_form', 'whatsapp_intent']).default('website_form'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'accepted', 'rejected', 'completed']),
  adminNotes: z.string().trim().max(1000).optional(),
});
