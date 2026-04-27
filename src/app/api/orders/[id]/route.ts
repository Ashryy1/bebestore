import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import SupportMessage from '@/lib/models/SupportMessage';

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
        if (body.status && body.status !== order.status) {
            const oldStatus = order.status;
            order.status = body.status;

            // Automated Support Message
            if (order.userId) {
                await SupportMessage.create({
                    userId: order.userId,
                    sender: 'admin',
                    content: `📢 تحديث تلقائي: حالة طلبك رقم #${order.orderNumber} تغيرت إلى [${body.status}].\n\n📢 Automatic Update: Your order #${order.orderNumber} status changed to [${body.status}].`
                });
            }
        }

        // Handle Deposit Fields
        if (body.depositAmount !== undefined) order.depositAmount = body.depositAmount;
        if (body.depositStatus !== undefined) order.depositStatus = body.depositStatus;
        if (body.depositScreenshot !== undefined) order.depositScreenshot = body.depositScreenshot;
        if (body.isChatOpen !== undefined) order.isChatOpen = body.isChatOpen;

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

        if (body.isChatOpen !== undefined) {
            order.isChatOpen = body.isChatOpen;
        }

        await order.save();
        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Order PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
