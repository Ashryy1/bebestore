import mongoose, { Schema, models, model } from 'mongoose';

export interface IPushSubscription {
    _id?: string;
    userId?: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    createdAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
    {
        userId: { type: String, index: true },
        endpoint: { type: String, required: true, unique: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const PushSubscription =
    models.PushSubscription || model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
