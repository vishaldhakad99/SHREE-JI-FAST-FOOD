import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantSettings extends Document {
  restaurantName: string;
  tagline: string;
  logoUrl?: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  address: string;
  openingHours: string;
  googleMapsEmbedUrl?: string;
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  aboutText: string;
  specialitiesText: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  noticeBanner?: {
    enabled: boolean;
    text: string;
  };
  updatedAt: Date;
}

const restaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    restaurantName: {
      type: String,
      required: true,
      default: 'SHREE JI FAST FOOD',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Ghar Jaisa Swad, Har Din Kuch Khaas!',
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: '[Phone number - Please update in Admin Settings]',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '[WhatsApp number - Please update in Admin Settings]',
      trim: true,
    },
    email: {
      type: String,
      default: '[Email - Please update in Admin Settings]',
      trim: true,
    },
    address: {
      type: String,
      default: '[Restaurant Address - Please update in Admin Settings]',
      trim: true,
    },
    openingHours: {
      type: String,
      default: '[Opening Hours - Please update in Admin Settings: e.g. Mon - Sun: 8:00 AM - 10:00 PM]',
      trim: true,
    },
    googleMapsEmbedUrl: {
      type: String,
      trim: true,
    },
    isDeliveryAvailable: {
      type: Boolean,
      default: false, // Default false until owner configures delivery availability
    },
    isPickupAvailable: {
      type: Boolean,
      default: true,
    },
    aboutText: {
      type: String,
      default: 'Welcome to Shree Ji Fast Food! We are committed to serving freshly prepared, wholesome Indian meals every single day. From our renowned Aloo Parathas and comforting Puri Sabji to our complete Special Thalis, our kitchen prepares each dish with pure ingredients, authentic home-style flavors, and customized taste according to your preference.',
      trim: true,
    },
    specialitiesText: {
      type: String,
      default: 'Our signature dishes include the Famous Aloo Paratha stuffed with fresh seasoned potatoes, aromatic daily Special Thalis, and fresh Puri Sabji served piping hot. Custom dishes prepared upon request!',
      trim: true,
    },
    socialLinks: {
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    noticeBanner: {
      enabled: { type: Boolean, default: false },
      text: { type: String, trim: true, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const RestaurantSettings = mongoose.model<IRestaurantSettings>('RestaurantSettings', restaurantSettingsSchema);
