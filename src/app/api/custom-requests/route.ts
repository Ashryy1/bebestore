import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomRequest } from '@/lib/models/CustomRequest';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        await connectDB();

        let requests;
        if (user.role === 'admin') {
            requests = await CustomRequest.find().sort({ createdAt: -1 }).lean();
        } else {
            requests = await CustomRequest.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
        }

        return NextResponse.json({ requests });
    } catch (error: any) {
        console.error('CustomRequests GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();
        const body = await req.json();

        // Require either Auth OR Guest Info (Phone)
        if (!user && !body.userPhone) {
            return NextResponse.json({ error: 'Authentication or Phone Number required' }, { status: 401 });
        }

        await connectDB();

        const orderNumber = `KR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const customRequest = await CustomRequest.create({
            userId: user?.userId,
            userName: body.userName || 'Anonymous',
            userEmail: user?.email || '',
            userPhone: body.userPhone || '',
            orderNumber,
            description: body.description,
            referenceImages: body.referenceImages || [],
            status: 'Pending',
            timeline: [
                {
                    status: 'Pending',
                    timestamp: new Date(),
                    note: 'Request submitted successfully',
                },
            ],
        });

        return NextResponse.json({ request: customRequest }, { status: 201 });
    } catch (error: any) {
        console.error('CustomRequests POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
