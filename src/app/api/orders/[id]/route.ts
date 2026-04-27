import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectDB();

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ order });

    } catch (error: any) {
        console.error('Order GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();

        await connectDB();
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Handle Status Update
        if (body.status) {
            order.status = body.status;
        }

        // Handle Deposit Fields
        if (body.depositAmount !== undefined) order.depositAmount = body.depositAmount;
        if (body.depositStatus !== undefined) order.depositStatus = body.depositStatus;
        if (body.depositScreenshot !== undefined) order.depositScreenshot = body.depositScreenshot;

        order.hasUnreadUpdate = true;

        await order.save();

        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Order PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { depositScreenshot, hasUnreadUpdate } = body;

        await connectDB();
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (depositScreenshot) {
            order.depositScreenshot = depositScreenshot;
            order.depositStatus = 'Pending';
        }

        if (hasUnreadUpdate !== undefined) {
            order.hasUnreadUpdate = hasUnreadUpdate;
        }

        await order.save();
        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Order PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
