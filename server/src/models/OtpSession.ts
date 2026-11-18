import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpSession extends Document {
  identifier: string;
  type: 'phone' | 'email';
  otp: string;
  customerName?: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const OtpSessionSchema = new Schema<IOtpSession>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['phone', 'email'],
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto delete from MongoDB after expiry
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const OtpSession = mongoose.model<IOtpSession>('OtpSession', OtpSessionSchema);
