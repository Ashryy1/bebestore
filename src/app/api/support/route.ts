import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SupportMessage from '@/lib/models/SupportMessage';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const messages = await SupportMessage.find({ userId: session.userId }).sort({ createdAt: 1 });
        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { content } = await req.json();
        if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

        await connectDB();
        const newMessage = await SupportMessage.create({
            userId: session.userId,
            sender: 'user',
            content
        });

        return NextResponse.json({ message: newMessage });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function PATCH() {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        await SupportMessage.updateMany(
            { userId: session.userId, sender: 'admin', isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
    }
}
