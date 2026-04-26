import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        try {
            await connectDB();
        } catch (dbError) {
            console.error('DB Connection failed in Categories:', dbError);
            return NextResponse.json([]); // Return empty array for resilience
        }

        const categories = await Category.find().sort({ name: 1 }).catch(() => []);
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Categories GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();
        const { name } = await req.json();

        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const category = await Category.create({ name, slug });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
