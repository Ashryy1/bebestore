import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        await connectDB();
        await Category.findByIdAndDelete(params.id);
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
