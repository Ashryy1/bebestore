import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomRequest } from '@/lib/models/CustomRequest';
import { Order } from '@/lib/models/Order';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || searchParams.get('phone');

        if (!query) {
            return NextResponse.json({ error: 'Search query required' }, { status: 400 });
        }

        await connectDB();

        // Search both collections
        const [requests, shopOrders] = await Promise.all([
            CustomRequest.find({
                $or: [
                    { userPhone: query },
                    { orderNumber: query.toUpperCase() },
                ]
            }).sort({ createdAt: -1 }).lean(),
            Order.find({
                $or: [
                    { userPhone: query },
                    { orderNumber: query.toUpperCase() },
                ]
            }).sort({ createdAt: -1 }).lean()
        ]);

        return NextResponse.json({
            requests,
            shopOrders,
            all: [...requests, ...shopOrders].sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
        });
    } catch (error: any) {
        console.error('CustomRequests Track GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
