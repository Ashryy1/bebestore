import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { requireUser, hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        const session = await requireUser();
        await connectDB();

        const user = await User.findById(session.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await requireUser();
        await connectDB();

        const body = await req.json();
        const { name, email, phone, image, password, currentPassword } = body;

        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (phone) user.phone = phone;
        if (image !== undefined) user.image = image;

        if (password) {
            // Verify current password for security
            const { comparePassword } = await import('@/lib/auth');
            const isMatch = await comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
            }
            user.password = await hashPassword(password);
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        return NextResponse.json({ user: updatedUser });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
