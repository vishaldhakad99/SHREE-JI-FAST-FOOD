import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { RestaurantSettings } from '../models/RestaurantSettings.js';

const updatePhone = async () => {
  try {
    await connectDB();
    console.log('[Update Settings] Connected to MongoDB Atlas...');

    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({
        restaurantName: 'SHREE JI FAST FOOD',
        tagline: 'Ghar Jaisa Swad, Har Din Kuch Khaas!',
        phoneNumber: '8839290150',
        whatsappNumber: '8839290150',
        email: 'shreejifastfood@gmail.com',
        address: 'Shree Ji Fast Food, Near Main Market',
        openingHours: 'Mon - Sun: 08:00 AM - 10:30 PM',
        isDeliveryAvailable: true,
        isPickupAvailable: true,
      });
    } else {
      settings.phoneNumber = '8839290150';
      settings.whatsappNumber = '8839290150';
      settings.isDeliveryAvailable = true;
      settings.isPickupAvailable = true;
      await settings.save();
    }

    console.log('[Update Settings] SUCCESS! WhatsApp & Phone set to 8839290150 in MongoDB Atlas:', settings);
    process.exit(0);
  } catch (err) {
    console.error('Error updating settings:', err);
    process.exit(1);
  }
};

updatePhone();
