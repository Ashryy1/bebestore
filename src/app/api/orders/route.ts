import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userName, userPhone, items, totalAmount, userId, shippingDetails } = body;

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
        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('Order GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
