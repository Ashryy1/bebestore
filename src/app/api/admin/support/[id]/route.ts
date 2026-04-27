import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SupportMessage from '@/lib/models/SupportMessage';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthUser();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const messages = await SupportMessage.find({ userId: params.id }).sort({ createdAt: 1 });

        // Mark as read
        await SupportMessage.updateMany(
            { userId: params.id, sender: 'user', isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getAuthUser();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, image } = await req.json();
        if (!content && !image) return NextResponse.json({ error: 'Content or image is required' }, { status: 400 });

        await connectDB();
        const newMessage = await SupportMessage.create({
            userId: params.id,
            sender: 'admin',
            content: content || '',
            image
        });

        return NextResponse.json({ message: newMessage });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
