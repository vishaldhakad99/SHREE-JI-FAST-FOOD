import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  categoryName?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  isSpecial: boolean;
  isTodaysSpecial: boolean;
  isFeatured: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  preparationTimeMinutes?: number;
  customizationOptions?: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>(
  {
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'FoodCategory',
      required: [true, 'Category reference is required'],
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    isVegetarian: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isSpecial: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Spicy'],
      default: 'Medium',
    },
    preparationTimeMinutes: {
      type: Number,
      min: 1,
      max: 120,
      default: 15,
    },
    customizationOptions: [{
      type: String,
      trim: true,
    }],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

foodItemSchema.index({ category: 1, isAvailable: 1 });
foodItemSchema.index({ isTodaysSpecial: 1, isAvailable: 1 });

export const FoodItem = mongoose.model<IFoodItem>('FoodItem', foodItemSchema);
