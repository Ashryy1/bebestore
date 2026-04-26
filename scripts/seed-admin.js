// Quick seed script to create an admin user
// Run: node scripts/seed-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

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

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD not found in .env');
        process.exit(1);
    }

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
