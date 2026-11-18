import mongoose, { Document, Schema } from 'mongoose';

export interface IContactEnquiry extends Document {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  isRead: boolean;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const contactEnquirySchema = new Schema<IContactEnquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$|^$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+ \-()]{8,20}$/, 'Please provide a valid phone number'],
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [120, 'Subject cannot exceed 120 characters'],
      default: 'General Restaurant Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });

export const ContactEnquiry = mongoose.model<IContactEnquiry>('ContactEnquiry', contactEnquirySchema);
