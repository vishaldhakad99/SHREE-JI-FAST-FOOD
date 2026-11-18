import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@shreejifastfood.com';
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'ShreeJiAdmin#2026';
    const name = process.env.INITIAL_ADMIN_NAME || 'Restaurant Manager';

    if (!password || password.length < 8) {
      throw new Error('Admin password must be at least 8 characters long.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    let admin = await Admin.findOne({ email });

    if (admin) {
      console.log(`[Admin Seed] Existing admin found for ${email}. Updating credentials...`);
      admin.name = name;
      admin.passwordHash = passwordHash;
      admin.isActive = true;
      admin.role = 'superadmin';
      await admin.save();
      console.log(`[Admin Seed] Admin account for ${email} updated successfully.`);
    } else {
      admin = await Admin.create({
        name,
        email,
        passwordHash,
        role: 'superadmin',
        isActive: true,
      });
      console.log(`[Admin Seed] Superadmin created successfully with email: ${email}`);
    }

    console.log(`[Admin Seed] Note: Store credentials securely. Never commit them to version control.`);
  } catch (error) {
    console.error('[Admin Seed] Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Admin Seed] Database disconnected.');
  }
};

seedAdmin();
