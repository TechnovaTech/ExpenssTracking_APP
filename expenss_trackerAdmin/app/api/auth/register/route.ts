import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const db = await getAdminDb();
    
    const exists = await db.collection('users').findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'User exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    });

    const token = generateToken(result.insertedId.toString());
    return NextResponse.json({ token, userId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
