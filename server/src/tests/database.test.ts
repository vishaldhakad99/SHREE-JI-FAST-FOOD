import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { FoodItem } from '../models/FoodItem.js';
import { FoodCategory } from '../models/FoodCategory.js';
import { DailyMenu } from '../models/DailyMenu.js';
import { OrderEnquiry } from '../models/OrderEnquiry.js';
import { RestaurantSettings } from '../models/RestaurantSettings.js';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'super_secret_shreeji_fastfood_jwt_token_key_2026_xyz';
}

describe('Live Database End-to-End API Integration', () => {
  const app = createApp();
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreeji_fastfood');
    }

    const { Admin } = await import('../models/Admin.js');
    const jwt = await import('jsonwebtoken');
    let admin = await Admin.findOne({ email: 'admin@shreejifastfood.com' });
    if (!admin) {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('ShreeJiAdmin#2026', 10);
      admin = await Admin.create({
        name: 'Shree Ji Manager',
        email: 'admin@shreejifastfood.com',
        passwordHash: hash,
        role: 'superadmin',
        isActive: true,
      });
    }

    adminToken = jwt.default.sign(
      { id: admin._id.toString(), email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'super_secret_shreeji_fastfood_jwt_token_key_2026_xyz',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Keep DB connection or close gracefully
  });

  it('GET /api/food/categories should return all categories from MongoDB', async () => {
    const res = await request(app).get('/api/food/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.categories.length).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/food should return food items with category populated', async () => {
    const res = await request(app).get('/api/food');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0]).toHaveProperty('name');
    expect(res.body.items[0]).toHaveProperty('price');
    expect(res.body.items[0]).toHaveProperty('category');
  });

  it('GET /api/daily-menu should respond properly (either today menu or polite update message)', async () => {
    const res = await request(app).get('/api/daily-menu');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('hasMenu');
  });

  it('POST /api/daily-menu should allow admin to create/update daily menu', async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const res = await request(app)
      .post('/api/daily-menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        date: todayStr,
        title: "Today's Special Fresh Gujarati & Punjabi Thali",
        specialAnnouncement: "Today's Special: Piping Hot Kadhi Khichdi & Gajar Ka Halwa available!",
        items: [
          {
            name: 'Fresh Kadhi Khichdi with Desi Ghee',
            description: 'Slow-cooked traditional khichdi served with sweet and tangy Gujarati kadhi, papad, and fresh pickle.',
            price: 130,
            category: 'Daily Special',
            isAvailable: true,
            isSpecial: true,
          },
          {
            name: 'Paneer Butter Masala Combo',
            description: 'Cottage cheese cubes simmered in creamy makhani gravy served with 4 phulkas and rice.',
            price: 160,
            category: 'Daily Special',
            isAvailable: true,
            isSpecial: true,
          },
        ],
        isActive: true,
      });

    expect(res.status).toBeOneOf([200, 201]);
    expect(res.body.success).toBe(true);
    expect(res.body.menu.items.length).toBe(2);
  });

  it('GET /api/daily-menu now returns the newly created today menu immediately', async () => {
    const res = await request(app).get('/api/daily-menu');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.hasMenu).toBe(true);
    expect(res.body.menu.items.length).toBe(2);
  });

  it('POST /api/orders should accept a valid order inquiry and return formatted WhatsApp URL', async () => {
    const res = await request(app).post('/api/orders').send({
      customerName: 'Ramesh Patel',
      customerPhone: '9876543210',
      foodItemName: 'Famous Aloo Paratha',
      quantity: 3,
      deliveryType: 'pickup',
      additionalRequirements: 'Extra crispy with less green chili',
      source: 'website_form',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.whatsappUrl).toContain('wa.me');
    expect(res.body.order.customerName).toBe('Ramesh Patel');
  });

  it('GET /api/orders should allow admin to view inquiries and update status', async () => {
    const listRes = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.orders.length).toBeGreaterThan(0);

    const firstOrderId = listRes.body.orders[0]._id;

    const patchRes = await request(app)
      .patch(`/api/orders/${firstOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'contacted',
        adminNotes: 'Customer contacted via WhatsApp. Order confirmed for pickup at 1:30 PM.',
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.order.status).toBe('contacted');
  });

  it('GET /api/settings returns settings with editable placeholders', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.settings.restaurantName).toBe('SHREE JI FAST FOOD');
    expect(res.body.settings.tagline).toBe('Ghar Jaisa Swad, Har Din Kuch Khaas!');
  });
});
