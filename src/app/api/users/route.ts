import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth';
import { generateReadableId } from '@/lib/utils';

export async function GET() {
    try {
        await requireAdmin();
        await connectDB();
        const users = await User.find({}, '-password').sort({ createdAt: -1 });

        // Lazy migration for readableId
        const migratedUsers = await Promise.all(users.map(async (u: any) => {
            const userObj = u.toObject ? u.toObject() : u;
            if (!userObj.readableId) {
                const newId = generateReadableId();
                await User.updateOne({ _id: u._id }, { $set: { readableId: newId } });
                return { ...userObj, readableId: newId };
            }
            return userObj;
        }));

        return NextResponse.json(migratedUsers);
    } catch (error: any) {
        const status = error.message?.includes('Unauthorized') ? 401 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}
