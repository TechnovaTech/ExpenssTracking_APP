import { NextRequest, NextResponse } from 'next/server';
import { getUserDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const db = await getUserDb(payload.userId);
    
    const totalExpenses = await db.collection('expenses').countDocuments({});
    const totalAmount = await db.collection('expenses').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    
    const byCategory = await db.collection('expenses').aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]).toArray();

    return NextResponse.json({
      totalExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      byCategory
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
