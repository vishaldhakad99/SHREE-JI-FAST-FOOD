import { Request, Response, NextFunction } from 'express';
import { ContactEnquiry } from '../models/ContactEnquiry.js';
import { contactEnquirySchema } from '../validators/contact.validator.js';

export const createContactEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = contactEnquirySchema.parse(req.body);

    const enquiry = await ContactEnquiry.create(data);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Shree Ji Fast Food. We will get back to you shortly!',
      enquiryId: enquiry._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactEnquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [enquiries, total, unreadCount] = await Promise.all([
      ContactEnquiry.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      unreadCount,
      totalPages: Math.ceil(total / limit),
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, isRead } = req.body;

    const enquiry = await ContactEnquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Contact inquiry not found.' });
      return;
    }

    if (status) enquiry.status = status;
    if (isRead !== undefined) enquiry.isRead = isRead;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Contact inquiry status updated.',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};
