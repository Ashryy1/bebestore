// Quick seed script to create an admin user
// Run: node scripts/seed-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: { type: String, default: 'user' },
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const adminEmail = 'hossaamashour@gmail.com';
    const adminPassword = 'Ashry1410';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
        console.log('⚠️  Admin user already exists. Updating role to admin...');
        existing.role = 'admin';
        await existing.save();
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });
    }

    console.log('\n🎉 Admin user ready!');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');

    await mongoose.disconnect();
}

seed().catch(console.error);
