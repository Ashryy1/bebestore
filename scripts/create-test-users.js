const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createTestUsers() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const userSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            password: String,
            role: { type: String, default: 'user' },
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const testAccounts = [
            {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Test User',
                email: 'user@test.com',
                password: 'user123',
                role: 'user'
            }
        ];

        for (const account of testAccounts) {
            const existing = await User.findOne({ email: account.email });
            const hashedPassword = await bcrypt.hash(account.password, 10);

            if (existing) {
                console.log(`⚠️  ${account.name} account already exists. Updating...`);
                existing.name = account.name;
                existing.password = hashedPassword;
                existing.role = account.role;
                await existing.save();
            } else {
                await User.create({
                    name: account.name,
                    email: account.email,
                    password: hashedPassword,
                    role: account.role
                });
                console.log(`✅ ${account.name} account created.`);
            }
        }

        console.log('\n🎉 Test accounts ready!');
        testAccounts.forEach(a =\u003e {
            console.log(`   Role:     ${a.role.toUpperCase()}`);
            console.log(`   Email:    ${a.email}`);
            console.log(`   Password: ${a.password}`);
            console.log('   ---');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createTestUsers();
