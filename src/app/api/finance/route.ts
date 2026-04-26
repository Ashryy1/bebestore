import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Finance } from '@/lib/models/Finance';
import { requireAdmin } from '@/lib/auth';

import { Order } from '@/lib/models/Order';
import { CustomRequest } from '@/lib/models/CustomRequest';

export async function GET() {
    try {
        await requireAdmin();
        await connectDB();

        // Fetch manual finance records
        const records = await Finance.find().sort({ date: -1 }).lean();

        // Fetch completed orders for automatic income calculation
        const [orders, requests] = await Promise.all([
            Order.find({ status: 'Completed' }).lean(),
            CustomRequest.find({ status: 'Completed' }).lean()
        ]);

        const orderIncome = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const requestIncome = requests.reduce((sum: number, r: any) => sum + (r.adminQuote || 0), 0);
        const totalOrderIncome = orderIncome + requestIncome;

        return NextResponse.json({
            records,
            summary: {
                orderIncome: totalOrderIncome,
                orderCount: orders.length + requests.length
            }
        });
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
