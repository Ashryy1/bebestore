import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { CustomRequest } from '@/lib/models/CustomRequest';
import { Finance } from '@/lib/models/Finance';
import { PushSubscription } from '@/lib/models/PushSubscription';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { sendPushNotification } from '@/lib/push';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const request = await CustomRequest.findById(id).lean() as any;

        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Allow public access for tracking, but mask sensitive data if not owner?
        // For now, let's allow it as the user requested.

        return NextResponse.json({ request });
    } catch (error: any) {
        console.error('CustomRequest GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        await connectDB();
        const request = await CustomRequest.findById(id);

        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Allowed guest updates: Shipping Details and Order Confirmation
        if (body.shippingDetails) {
            request.shippingDetails = body.shippingDetails;
        }

        if (body.depositScreenshot) {
            request.depositScreenshot = body.depositScreenshot;
            request.depositStatus = 'Pending';
            request.timeline.push({
                status: 'Deposit Paid',
                timestamp: new Date(),
                note: body.timelineNote || `Deposit proof uploaded by user`,
            });
        }

        await request.save();

        return NextResponse.json({ request });
    } catch (error: any) {
        console.error('CustomRequest PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin();
        await connectDB();

        const { id } = await params;
        const body = await req.json();

        const request = await CustomRequest.findById(id);
        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Update status
        if (body.status) {
            const oldStatus = request.status;
            request.status = body.status;
            request.timeline.push({
                status: body.status,
                timestamp: new Date(),
                note: body.note || `Status updated to ${body.status}`,
            });

            // Financial Impact
            if (body.status === 'Completed' && oldStatus !== 'Completed') {
                await Finance.create({
                    type: 'income',
                    category: 'order_profit',
                    amount: request.adminQuote || 0,
                    description: `Custom Order Completed: ${request.description.slice(0, 30)}...`,
                    orderId: request._id,
                });
            } else if (body.status === 'Returned' && oldStatus === 'Completed') {
                await Finance.create({
                    type: 'expense',
                    category: 'order_return',
                    amount: request.adminQuote || 0,
                    description: `Order Returned: ${request.description.slice(0, 30)}...`,
                    orderId: request._id,
                });
            }
        }

        // Update quote
        if (body.adminQuote !== undefined) {
            request.adminQuote = body.adminQuote;
            request.timeline.push({
                status: 'Pricing',
                timestamp: new Date(),
                note: `Price quote set: $${body.adminQuote}`,
            });
        }

        // Update admin notes
        if (body.adminNotes) {
            request.adminNotes = body.adminNotes;
        }

        // Update deposit fields
        if (body.depositAmount !== undefined) request.depositAmount = body.depositAmount;
        if (body.depositStatus !== undefined) request.depositStatus = body.depositStatus;
        if (body.depositScreenshot !== undefined) request.depositScreenshot = body.depositScreenshot;

        await request.save();

        // Send push notification to the user
        const subscriptions = await PushSubscription.find({ userId: request.userId });
        const notificationPayload = {
            title: '🧶 BibaStore - Order Update',
            body: body.depositStatus === 'Requested'
                ? `Deposit requested: EGP ${body.depositAmount}. Please upload proof of payment.`
                : body.status
                    ? `Your custom request status changed to: ${body.status}`
                    : body.adminQuote
                        ? `New price quote: EGP ${body.adminQuote}. Check it out!`
                        : 'Your custom request has been updated.',
            url: `/track/${id}`,
            tag: `request-${id}`,
        };

        for (const sub of subscriptions) {
            const result = await sendPushNotification(
                { endpoint: sub.endpoint, keys: sub.keys },
                notificationPayload
            );
            if (result.expired) {
                await PushSubscription.findByIdAndDelete(sub._id);
            }
        }

        return NextResponse.json({ request });
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        console.error('CustomRequest PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
