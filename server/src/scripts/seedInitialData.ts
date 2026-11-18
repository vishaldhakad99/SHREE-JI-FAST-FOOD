import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { FoodCategory } from '../models/FoodCategory.js';
import { FoodItem } from '../models/FoodItem.js';
import { RestaurantSettings } from '../models/RestaurantSettings.js';

const initialCategories = [
  {
    name: 'Special Parathas',
    slug: 'special-parathas',
    description: 'Crispy, golden, piping-hot tawa parathas stuffed generously with spiced fillings and served with fresh curd and pickle.',
    sortOrder: 1,
  },
  {
    name: 'Thali',
    slug: 'thali',
    description: 'Complete, wholesome traditional Indian meal plates featuring freshly made seasonal sabjis, dal, hot rotis/puris, rice, and accompaniments.',
    sortOrder: 2,
  },
  {
    name: 'Puri Sabji',
    slug: 'puri-sabji',
    description: 'Freshly fried hot puris served with aromatic spiced aloo bhaji or chole, prepared in authentic traditional style.',
    sortOrder: 3,
  },
  {
    name: 'Daily Meals',
    slug: 'daily-meals',
    description: 'Home-style everyday fresh meals prepared daily with light spices and wholesome homestyle ingredients.',
    sortOrder: 4,
  },
  {
    name: 'Other Food Items',
    slug: 'other-food-items',
    description: 'Appetizers, sides, beverages, and daily tea/snack accompaniments.',
    sortOrder: 5,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed Data] Seeding categories...');
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const cat of initialCategories) {
      let existing = await FoodCategory.findOne({ slug: cat.slug });
      if (!existing) {
        existing = await FoodCategory.create(cat);
        console.log(` Created category: ${cat.name}`);
      } else {
        console.log(` Category exists: ${cat.name}`);
      }
      categoryMap.set(cat.slug, existing._id as mongoose.Types.ObjectId);
    }

    // Default Restaurant Settings with clearly marked editable placeholders
    console.log('[Seed Data] Ensuring Restaurant Settings...');
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({
        restaurantName: 'SHREE JI FAST FOOD',
        tagline: 'Ghar Jaisa Swad, Har Din Kuch Khaas!',
        phoneNumber: '[Update Phone Number in Admin Settings]',
        whatsappNumber: '[Update WhatsApp Number in Admin Settings: e.g. 919876543210]',
        email: '[Update Email in Admin Settings]',
        address: '[Update Full Address in Admin Settings: Shop No., Street, City, Pincode]',
        openingHours: 'Mon - Sun: 08:00 AM - 10:00 PM [Editable in Admin Settings]',
        isDeliveryAvailable: false, // Owner enables when ready
        isPickupAvailable: true,
        aboutText: 'Welcome to Shree Ji Fast Food! We take immense pride in serving authentic, freshly cooked Indian meals every day. Our signature is pure home-style taste ("Ghar Jaisa Swad"), prepared with love, top-quality ingredients, and complete hygiene. Customers love our flexibility to prepare dishes according to their specific taste and dietary preferences.',
        specialitiesText: 'Known across town for our Famous Aloo Paratha, rich Special Thalis, steaming Puri Sabji, and daily rotating vegetable preparations made fresh to order.',
      });
      console.log(' Default restaurant settings initialized with editable placeholders.');
    }

    // Check if food items exist
    const count = await FoodItem.countDocuments();
    if (count === 0) {
      console.log('[Seed Data] Adding initial authentic menu items with editable prices...');

      const sampleFoodItems = [
        {
          name: 'Famous Aloo Paratha',
          slug: 'famous-aloo-paratha',
          description: 'Our crown specialty! Hand-rolled wheat flatbread stuffed with spiced mashed potatoes, fresh green coriander, and mild roasted spices. Served with curd and home-style pickle.',
          price: 70, // Base default price, easily editable by owner
          category: categoryMap.get('special-parathas'),
          imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: true,
          isTodaysSpecial: true,
          isFeatured: true,
          spiceLevel: 'Medium',
          preparationTimeMinutes: 15,
          customizationOptions: ['Extra butter', 'Less spicy', 'Without onion/garlic', 'Crispy cooked'],
          sortOrder: 1,
        },
        {
          name: 'Special Paneer Paratha',
          slug: 'special-paneer-paratha',
          description: 'Loaded with freshly grated paneer, fresh ginger, green chilies, and aromatic spices, roasted on tawa with desi ghee or butter.',
          price: 110,
          category: categoryMap.get('special-parathas'),
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: true,
          isTodaysSpecial: false,
          isFeatured: true,
          spiceLevel: 'Medium',
          preparationTimeMinutes: 15,
          customizationOptions: ['Extra butter', 'Green chili extra', 'Mild spice'],
          sortOrder: 2,
        },
        {
          name: 'Mix Veg Paratha',
          slug: 'mix-veg-paratha',
          description: 'Wholesome paratha stuffed with freshly grated seasonal vegetables (cauliflower, carrots, green peas, potatoes) infused with carom seeds and garam masala.',
          price: 90,
          category: categoryMap.get('special-parathas'),
          imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: false,
          isTodaysSpecial: false,
          isFeatured: false,
          spiceLevel: 'Medium',
          preparationTimeMinutes: 15,
          customizationOptions: ['Less spicy', 'Extra crispy'],
          sortOrder: 3,
        },
        {
          name: 'Special Shahi Thali',
          slug: 'special-shahi-thali',
          description: 'The royal experience: 2 seasonal sabjis (1 paneer special + 1 dry vegetable), Dal Tadka, Jeera Rice, 4 fresh butter rotis or 4 puris, fresh salad, raita, pickle, and sweet of the day.',
          price: 180,
          category: categoryMap.get('thali'),
          imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: true,
          isTodaysSpecial: true,
          isFeatured: true,
          spiceLevel: 'Medium',
          preparationTimeMinutes: 20,
          customizationOptions: ['Choose Roti or Puri', 'Less oil', 'No onion garlic upon request'],
          sortOrder: 1,
        },
        {
          name: 'Standard Daily Thali',
          slug: 'standard-daily-thali',
          description: 'Nutritious homestyle thali with 1 fresh daily vegetable sabji, homestyle yellow dal, 4 tawa rotis, steamed rice, and fresh pickle.',
          price: 120,
          category: categoryMap.get('thali'),
          imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: false,
          isTodaysSpecial: false,
          isFeatured: true,
          spiceLevel: 'Mild',
          preparationTimeMinutes: 15,
          customizationOptions: ['Add butter to roti', 'Plain dal'],
          sortOrder: 2,
        },
        {
          name: 'Fresh Puri Sabji Combo',
          slug: 'fresh-puri-sabji-combo',
          description: 'Crisp, hot, golden puris (4 pieces) served with traditionally spiced, mouthwatering Tariwale Aloo (potato curry), pickle, and sliced onions.',
          price: 80,
          category: categoryMap.get('puri-sabji'),
          imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: true,
          isTodaysSpecial: true,
          isFeatured: true,
          spiceLevel: 'Medium',
          preparationTimeMinutes: 12,
          customizationOptions: ['Extra puri', 'Mild gravy'],
          sortOrder: 1,
        },
        {
          name: 'Daily Ghar Jaisa Meal (Dal Roti Sabji)',
          slug: 'daily-ghar-jaisa-meal',
          description: 'Prepared fresh twice every day: light, wholesome, zero-soda, home-cooked dal, seasonal sabji, and soft whole-wheat phulkas.',
          price: 100,
          category: categoryMap.get('daily-meals'),
          imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b301b5c81d?q=80&w=800&auto=format&fit=crop',
          isVegetarian: true,
          isAvailable: true,
          isSpecial: false,
          isTodaysSpecial: true,
          isFeatured: true,
          spiceLevel: 'Mild',
          preparationTimeMinutes: 10,
          customizationOptions: ['Phulka with ghee', 'Plain phulka', 'Jain preparation'],
          sortOrder: 1,
        },
      ];

      for (const item of sampleFoodItems) {
        await FoodItem.create(item);
      }
      console.log(` Seeded ${sampleFoodItems.length} core food items with editable prices.`);
    }

    console.log('[Seed Data] Seeding complete!');
  } catch (error) {
    console.error('[Seed Data] Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed Data] Database disconnected.');
  }
};

seedData();
