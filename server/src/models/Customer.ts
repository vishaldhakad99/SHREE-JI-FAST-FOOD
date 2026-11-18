import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone?: string;
  email?: string;
  isVerified: boolean;
  authMethod: 'phone' | 'email';
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      trim: true,
      default: 'Valued Customer',
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    authMethod: {
      type: String,
      enum: ['phone', 'email'],
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
