import { NextRequest, NextResponse } from 'next/server';
import { getUserDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { amount, source, description, date } = await req.json();
    const db = await getUserDb(params.userId);
    
    const result = await db.collection('income').insertOne({
      userId: params.userId,
      amount,
      source,
      description,
      date: new Date(date),
      createdAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id, amount, source, description, date } = await req.json();
    const db = await getUserDb(params.userId);
    const { ObjectId } = require('mongodb');
    
    await db.collection('income').updateOne(
      { _id: new ObjectId(id) },
      { $set: { amount, source, description, date: new Date(date) } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    const db = await getUserDb(params.userId);
    const { ObjectId } = require('mongodb');
    
    await db.collection('income').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
