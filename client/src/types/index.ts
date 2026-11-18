export interface FoodCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FoodItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: FoodCategory | string;
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
  createdAt: string;
  updatedAt: string;
}

export interface DailyMenuItem {
  _id?: string;
  foodItem?: string | FoodItem;
  name: string;
  description?: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isSpecial: boolean;
  imageUrl?: string;
}

export interface DailyMenu {
  _id: string;
  date: string;
  dateString: string;
  title: string;
  specialAnnouncement?: string;
  items: DailyMenuItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderEnquiry {
  _id: string;
  customerName: string;
  customerPhone: string;
  foodItemId?: FoodItem | string;
  foodItemName: string;
  quantity: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  additionalRequirements?: string;
  estimatedPrice?: number;
  status: 'new' | 'contacted' | 'accepted' | 'rejected' | 'completed';
  adminNotes?: string;
  source: 'website_form' | 'whatsapp_intent';
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  _id?: string;
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
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  noticeBanner?: {
    enabled: boolean;
    text: string;
  };
}

export interface ContactEnquiry {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  isRead: boolean;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  lastLogin?: string;
}
