import { NextRequest, NextResponse } from 'next/server';
import { getUserDB } from '@/lib/mongodb';
import { getCategoryModel } from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Category = getCategoryModel(userDB);
    
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Category = getCategoryModel(userDB);
    
    const body = await req.json();
    const category = await Category.create(body);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
