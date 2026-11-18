import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrderStatus = 'new' | 'contacted' | 'accepted' | 'rejected' | 'completed';
export type DeliveryType = 'pickup' | 'delivery';

export interface IOrderEnquiry extends Document {
  customerName: string;
  customerPhone: string;
  foodItemId?: Types.ObjectId;
  foodItemName: string;
  quantity: number;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  additionalRequirements?: string;
  estimatedPrice?: number;
  status: OrderStatus;
  adminNotes?: string;
  source: 'website_form' | 'whatsapp_intent';
  createdAt: Date;
  updatedAt: Date;
}

const orderEnquirySchema = new Schema<IOrderEnquiry>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+ \-()]{8,20}$/, 'Please provide a valid phone number'],
      index: true,
    },
    foodItemId: {
      type: Schema.Types.ObjectId,
      ref: 'FoodItem',
    },
    foodItemName: {
      type: String,
      required: [true, 'Requested food item is required'],
      trim: true,
      maxlength: [120, 'Item name cannot exceed 120 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [100, 'Quantity cannot exceed 100 per inquiry'],
      default: 1,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
      default: 'pickup',
    },
    deliveryAddress: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    additionalRequirements: {
      type: String,
      trim: true,
      maxlength: [1000, 'Requirements cannot exceed 1000 characters'],
    },
    estimatedPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'accepted', 'rejected', 'completed'],
      default: 'new',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    source: {
      type: String,
      enum: ['website_form', 'whatsapp_intent'],
      default: 'website_form',
    },
  },
  {
    timestamps: true,
  }
);

orderEnquirySchema.index({ status: 1, createdAt: -1 });

export const OrderEnquiry = mongoose.model<IOrderEnquiry>('OrderEnquiry', orderEnquirySchema);
