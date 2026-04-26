import mongoose, { Schema, models, model } from 'mongoose';

export interface ICategory {
    _id?: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        image: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

export const Category = models.Category || model<ICategory>('Category', CategorySchema);
