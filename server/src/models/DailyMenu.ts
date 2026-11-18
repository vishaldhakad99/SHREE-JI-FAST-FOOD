import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDailyMenuItem {
  foodItem?: Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isSpecial: boolean;
  imageUrl?: string;
}

export interface IDailyMenu extends Document {
  date: Date;
  dateString: string; // YYYY-MM-DD for fast precise queries
  title: string;
  specialAnnouncement?: string;
  items: IDailyMenuItem[];
  isActive: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const dailyMenuItemSchema = new Schema<IDailyMenuItem>({
  foodItem: {
    type: Schema.Types.ObjectId,
    ref: 'FoodItem',
  },
  name: {
    type: String,
    required: [true, 'Daily dish name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Daily Special',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be non-negative'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
});

const dailyMenuSchema = new Schema<IDailyMenu>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    dateString: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: "Today's Fresh Daily Specials",
      trim: true,
    },
    specialAnnouncement: {
      type: String,
      trim: true,
      maxlength: [500, 'Announcement cannot exceed 500 characters'],
    },
    items: [dailyMenuItemSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

dailyMenuSchema.index({ dateString: 1, isActive: 1 });

export const DailyMenu = mongoose.model<IDailyMenu>('DailyMenu', dailyMenuSchema);
