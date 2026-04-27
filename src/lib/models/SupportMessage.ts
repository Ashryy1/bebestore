import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportMessage extends Document {
    userId: mongoose.Types.ObjectId;
    sender: 'user' | 'admin';
    content: string;
    image?: string;
    isRead: boolean;
    createdAt: Date;
}

const SupportMessageSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    content: { type: String, required: false },
    image: { type: String, required: false },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.models.SupportMessage || mongoose.model<ISupportMessage>('SupportMessage', SupportMessageSchema);
