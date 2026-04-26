import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function GET() {
    const session = await getAuthUser();
    if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        await connectDB();
        const user = await User.findById(session.userId).select('-password');
        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }
        return NextResponse.json({
            authenticated: true,
            user: {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
                phone: user.phone
            }
        });
    } catch {
        // Fallback if DB is down but token is valid
        return NextResponse.json({ authenticated: true, user: session });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    return response;
}
