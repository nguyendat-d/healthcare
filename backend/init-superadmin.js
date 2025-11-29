#!/usr/bin/env node
/**
 * Initialize Super Admin Account
 * Usage: node init-superadmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const { hashPassword } = require('./src/utils/hash');

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'superadmin@healthcare.vn';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin@2025';
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'System Administrator';

async function initSuperAdmin() {
  try {
    console.log('🚀 Initializing Super Admin Account...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if Super Admin already exists
    let superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (superAdmin) {
      console.log(`📋 Super Admin account found (${SUPER_ADMIN_EMAIL})`);
      console.log(`   Current Status: ${superAdmin.status}`);
      
      // Update status if not ACTIVE
      if (superAdmin.status !== 'ACTIVE') {
        console.log('\n⚠️  Updating status to ACTIVE...');
        superAdmin.status = 'ACTIVE';
        
        // Hash new password
        superAdmin.passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);
        
        await superAdmin.save();
        console.log('✅ Status updated to ACTIVE');
        console.log(`✅ Password updated\n`);
      }
    } else {
      console.log(`📝 Creating new Super Admin account: ${SUPER_ADMIN_EMAIL}\n`);

      // Hash password
      const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);

      // Create Super Admin
      superAdmin = new User({
        email: SUPER_ADMIN_EMAIL,
        name: SUPER_ADMIN_NAME,
        passwordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        profile: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: process.env.SUPER_ADMIN_PHONE || '+84123456789',
        }
      });

      await superAdmin.save();
      console.log('✅ Super Admin account created successfully\n');
    }

    console.log('📊 Super Admin Account Details:');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log(`   Status: ${superAdmin.status}`);
    console.log(`   Phone: ${superAdmin.phone}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
    console.log('\n✅ Initialization completed successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing Super Admin:', err.message);
    process.exit(1);
  }
}

initSuperAdmin();
