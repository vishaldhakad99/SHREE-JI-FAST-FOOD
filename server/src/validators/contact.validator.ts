import { z } from 'zod';

export const contactEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().trim().min(8, 'Phone number must be at least 8 digits').max(20)
    .regex(/^[0-9+ \-()]+$/, 'Phone number must contain valid digits'),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(1000),
});
