import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SupportMessage from '@/lib/models/SupportMessage';
import { User } from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get unique user IDs who have sent messages
        const conversations = await SupportMessage.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$userId',
                    lastMessage: { $first: '$content' },
                    lastTimestamp: { $first: '$createdAt' },
                    unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$sender', 'user'] }, { $eq: ['$isRead', false] }] }, 1, 0] } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    userId: '$_id',
                    name: { $ifNull: ['$userInfo.name', 'Deleted User'] },
                    email: { $ifNull: ['$userInfo.email', 'N/A'] },
                    lastMessage: 1,
                    lastTimestamp: 1,
                    unreadCount: 1
                }
            },

            { $sort: { lastTimestamp: -1 } }
        ]);

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error('Admin Fetch Support Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
