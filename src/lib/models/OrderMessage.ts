import mongoose, { Schema, models, model } from 'mongoose';

export interface IOrderMessage {
    _id?: string;
    orderId: string;
    sender: 'user' | 'admin';
    content: string;
    image?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OrderMessageSchema = new Schema<IOrderMessage>(
    {
        orderId: { type: String, required: true, index: true },
        sender: { type: String, enum: ['user', 'admin'], required: true },
        content: { type: String, default: '' },
        image: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const OrderMessage = models.OrderMessage || model<IOrderMessage>('OrderMessage', OrderMessageSchema);
