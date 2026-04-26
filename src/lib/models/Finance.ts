import mongoose, { Schema, models, model } from 'mongoose';

export interface IFinance {
    _id?: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    date: Date;
    orderId?: string; // Optional link to an order
    createdAt: Date;
    updatedAt: Date;
}

const FinanceSchema = new Schema<IFinance>(
    {
        type: { type: String, enum: ['income', 'expense'], required: true },
        category: {
            type: String,
            required: true
        },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    },
    { timestamps: true }
);

export const Finance = models.Finance || model<IFinance>('Finance', FinanceSchema);
