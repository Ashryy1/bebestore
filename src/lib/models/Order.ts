import mongoose, { Schema, models, model } from 'mongoose';

export type OrderStatus = 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';

export interface IOrderItem {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
}

export interface IOrder {
    _id?: string;
    orderNumber: string;
    userName: string;
    userPhone: string;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingDetails?: {
        address: string;
        city: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, unique: true, required: true, index: true },
        userName: { type: String, required: true },
        userPhone: { type: String, required: true, index: true },
        items: [
            {
                productId: { type: String, required: true },
                title: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        shippingDetails: {
            address: { type: String },
            city: { type: String },
        },
    },
    { timestamps: true }
);

export const Order = models.Order || model<IOrder>('Order', OrderSchema);
