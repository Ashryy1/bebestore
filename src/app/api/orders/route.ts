import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import { CustomRequest } from '@/lib/models/CustomRequest';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userName, userPhone, items, totalAmount, userId, shippingDetails, isWhatsAppOrder } = body;

        if (!userPhone || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const orderNumber = `ORD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const order = await Order.create({
            orderNumber,
            userId,
            userName: userName || 'Customer',
            userPhone,
            items,
            totalAmount,
            shippingDetails,
            status: 'Pending',
            isWhatsAppOrder: !!isWhatsAppOrder,
        });

        return NextResponse.json({ order });
        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Order POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Fetch both Shop Orders and Custom Requests
        const [orders, customRequests] = await Promise.all([
            Order.find().sort({ createdAt: -1 }).lean(),
            CustomRequest.find().sort({ createdAt: -1 }).lean()
        ]);

        // Normalize both lists
        const normalizedOrders = orders.map((o: any) => ({
            ...o,
            source: 'shop'
        }));

        const normalizedCustom = customRequests.map((r: any) => ({
            ...r,
            source: 'custom',
            // Map common fields if they differ
            totalAmount: r.adminQuote || 0,
            items: r.items || [], // Requests might not have items array in same way
        }));

        // Merge and sort
        const allOrders = [...normalizedOrders, ...normalizedCustom].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ orders: allOrders });
    } catch (error: any) {
        console.error('Order GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
