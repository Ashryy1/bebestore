import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

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
