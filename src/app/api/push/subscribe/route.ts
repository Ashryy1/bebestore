import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PushSubscription } from '@/lib/models/PushSubscription';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { endpoint, keys } = body;

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
        }

        const user = await getAuthUser();
        const userId = user?.userId || undefined;

        await PushSubscription.findOneAndUpdate(
            { endpoint },
            { endpoint, keys, userId },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Subscription saved' });
    } catch (error: any) {
        console.error('Push subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
