import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PushSubscription } from '@/lib/models/PushSubscription';
import { requireAdmin } from '@/lib/auth';
import { sendPushNotification, PushPayload } from '@/lib/push';

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const body = await req.json();
        const { userId, payload }: { userId?: string; payload: PushPayload } = body;

        let subscriptions;
        if (userId) {
            subscriptions = await PushSubscription.find({ userId });
        } else {
            subscriptions = await PushSubscription.find();
        }

        let sent = 0;
        let failed = 0;

        for (const sub of subscriptions) {
            const result = await sendPushNotification(
                { endpoint: sub.endpoint, keys: sub.keys },
                payload
            );
            if (result.success) {
                sent++;
            } else {
                failed++;
                if (result.expired) {
                    await PushSubscription.findByIdAndDelete(sub._id);
                }
            }
        }

        return NextResponse.json({ sent, failed, total: subscriptions.length });
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        console.error('Push send error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
