import mongoose, { Schema, models, model } from 'mongoose';

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    phone?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        password: { type: String, required: true },
        image: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);
