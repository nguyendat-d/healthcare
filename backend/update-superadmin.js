require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

async function updateSuperAdmin() {
  try {
    console.log('🚀 Updating Super Admin Profile...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const superAdmin = await User.findOne({ email: 'superadmin@healthcare.vn' });
    
    if (!superAdmin) {
      console.log('❌ Super Admin not found');
      process.exit(1);
    }

    console.log('📋 Current Super Admin:');
    console.log('   Name:', superAdmin.name);
    console.log('   Profile:', superAdmin.profile);

    // Update profile with firstName/lastName
    superAdmin.profile = {
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+84123456789'
    };

    await superAdmin.save();

    console.log('\n✅ Super Admin profile updated:');
    console.log('   Name:', superAdmin.name);
    console.log('   Profile:', superAdmin.profile);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updateSuperAdmin();
