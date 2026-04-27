import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderMessage } from '@/lib/models/OrderMessage';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: orderId } = params;
        await connectDB();

        const messages = await OrderMessage.find({ orderId }).sort({ createdAt: 1 }).lean();

        return NextResponse.json({ messages });
    } catch (error: any) {
        console.error('Order Messages GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: orderId } = params;
        const body = await req.json();
        const { content, image } = body;

        const session = await getAuthUser();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sender = session.role === 'admin' ? 'admin' : 'user';

        await connectDB();
        const message = await OrderMessage.create({
            orderId,
            sender,
            content: content || '',
            image: image || '',
            isRead: false
        });

        return NextResponse.json({ message });
    } catch (error: any) {
        console.error('Order Messages POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id: orderId } = params;
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();

        // Mark messages from the "other" side as read
        const otherSide = session.role === 'admin' ? 'user' : 'admin';
        await OrderMessage.updateMany(
            { orderId, sender: otherSide, isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Order Messages PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
