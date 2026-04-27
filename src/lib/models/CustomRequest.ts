import mongoose, { Schema, models, model } from 'mongoose';

export type RequestStatus = 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';

export interface ITimelineEntry {
    status: string;
    timestamp: Date;
    note: string;
}

export interface ICustomRequest {
    _id?: string;
    userId?: string;
    userName: string;
    userEmail?: string;
    userPhone?: string;
    orderNumber: string;
    description: string;
    referenceImages: string[];
    status: RequestStatus;
    adminQuote: number | null;
    adminNotes: string;
    timeline: ITimelineEntry[];
    shippingDetails?: {
        address: string;
        city: string;
        phone: string;
    };
    depositAmount: number;
    depositStatus: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
    depositScreenshot?: string;
    createdAt: Date;
    updatedAt: Date;
    hasUnreadUpdate?: boolean;
}

const TimelineEntrySchema = new Schema<ITimelineEntry>(
    {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
    },
    { _id: false }
);

const CustomRequestSchema = new Schema<ICustomRequest>(
    {
        userId: { type: String, required: false, index: true },
        userName: { type: String, default: 'Anonymous' },
        userEmail: { type: String, default: '' },
        userPhone: { type: String, default: '' },
        orderNumber: { type: String, unique: true, sparse: true, index: true },
        description: { type: String, required: true },
        referenceImages: [{ type: String }],
        status: {
            type: String,
            enum: ['Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed', 'Returned'],
            default: 'Pending',
        },
        adminQuote: { type: Number, default: null },
        adminNotes: { type: String, default: '' },
        timeline: [TimelineEntrySchema],
        shippingDetails: {
            address: { type: String },
            city: { type: String },
            phone: { type: String },
        },
        depositAmount: { type: Number, default: 0 },
        depositStatus: {
            type: String,
            enum: ['None', 'Requested', 'Pending', 'Paid', 'Rejected'],
            default: 'None',
        },
        depositScreenshot: { type: String },
        hasUnreadUpdate: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const CustomRequest =
    models.CustomRequest || model<ICustomRequest>('CustomRequest', CustomRequestSchema);
