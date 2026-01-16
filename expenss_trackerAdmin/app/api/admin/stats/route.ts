import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getUserDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const adminDb = await getAdminDb();
    const users = await adminDb.collection('users').find({}).toArray();
    
    const userStats = [];
    for (const user of users) {
      const userDb = await getUserDb(user._id.toString());
      const expenseCount = await userDb.collection('expenses').countDocuments({});
      const totalAmount = await userDb.collection('expenses').aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      
      userStats.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        expenseCount,
        totalAmount: totalAmount[0]?.total || 0
      });
    }

    return NextResponse.json({ totalUsers: users.length, userStats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
