import webpush from 'web-push';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@bibastore.com';

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

export interface PushPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    tag?: string;
}

export async function sendPushNotification(
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    payload: PushPayload
) {
    try {
        await webpush.sendNotification(
            {
                endpoint: subscription.endpoint,
                keys: subscription.keys,
            },
            JSON.stringify(payload)
        );
        return { success: true };
    } catch (error: any) {
        console.error('Push notification failed:', error);
        if (error.statusCode === 410) {
            return { success: false, expired: true };
        }
        return { success: false, expired: false };
    }
}
