import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { CustomRequest } from '@/lib/models/CustomRequest';
import { Finance } from '@/lib/models/Finance';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        await requireAdmin();
        try {
            await connectDB();
        } catch (dbError) {
            console.error('DB Connection failed in Stats:', dbError);
            // Return dummy data for Local Test Mode
            return NextResponse.json({
                totalProducts: 0,
                pendingRequests: 0,
                revenue: 0,
                totalCustomers: 0,
                dbError: true
            });
        }

        const [totalProducts, pendingRequests, financeRecords, totalCustomers] = await Promise.all([
            Product.countDocuments().catch(() => 0),
            CustomRequest.countDocuments({ status: 'Pending' }).catch(() => 0),
            Finance.find().lean().catch(() => []),
            User.countDocuments({ role: 'user' }).catch(() => 0)
        ]);

        const revenue = (financeRecords as any[]).reduce((acc, curr) => {
            if (curr.type === 'income') return acc + curr.amount;
            if (curr.type === 'expense' && curr.category === 'return') return acc - curr.amount;
            return acc;
        }, 0);

        return NextResponse.json({
            totalProducts,
            pendingRequests,
            revenue,
            totalCustomers
        });
    } catch (error: any) {
        console.error('Admin Stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
