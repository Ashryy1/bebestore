import mongoose, { Schema, models, model } from 'mongoose';

export interface IProduct {
    _id?: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    colors: string[];
    stock: number;
    sizeChart: {
        type: 'table' | 'image';
        imageUrl?: string;
        sizes?: Array<{ label: string; dimensions: string }>;
    } | null;
    featured: boolean;
    rating: number;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        images: [{ type: String }],
        category: {
            type: String,
            required: true,
        },
        colors: [{ type: String }],
        stock: { type: Number, default: 0, min: 0 },
        sizeChart: {
            type: {
                type: String,
                enum: ['table', 'image'],
            },
            imageUrl: String,
            sizes: [
                {
                    label: { type: String },
                    dimensions: { type: String },
                },
            ],
        },
        featured: { type: Boolean, default: false },
        rating: { type: Number, default: 5, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ title: 'text', description: 'text' });

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
