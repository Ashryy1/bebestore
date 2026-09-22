import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();


        try {
            await connectDB();
        } catch (dbError) {
            console.error('DB Connection failed in Login:', dbError);
            return NextResponse.json({
                error: 'Database connection failed. Please try again later.',
                details: 'Database is currently unreachable in your environment.'
            }, { status: 503 });
        }

        try {
            const user = await User.findOne({
                $or: [
                    { email: email.toLowerCase() },
                    { phone: email }
                ]
            });

            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const isValid = await comparePassword(password, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = signToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            const response = NextResponse.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    image: user.image,
                    readableId: user.readableId
                },
            });

            response.cookies.set('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return response;
        } catch (queryError: any) {
            console.error('Login query error:', queryError);
            return NextResponse.json({ error: 'Authentication service temporarily unavailable' }, { status: 503 });
        }
    } catch (error: any) {
        console.error('Outer login error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
