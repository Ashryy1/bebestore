import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await requireAdmin();
        await connectDB();
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error: any) {
        const status = error.message?.includes('Unauthorized') ? 401 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}
