import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Finance } from '@/lib/models/Finance';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await requireAdmin();
        await connectDB();
        const records = await Finance.find().sort({ date: -1 });
        return NextResponse.json(records);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();
        const { type, category, amount, description, date } = await req.json();

        const record = await Finance.create({
            type,
            category,
            amount,
            description,
            date: date || new Date(),
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
