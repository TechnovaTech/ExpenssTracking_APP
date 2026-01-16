import { NextRequest, NextResponse } from 'next/server';
import { getUserDB } from '@/lib/mongodb';
import { getExpenseModel } from '@/models/Expense';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Expense = getExpenseModel(userDB);
    
    const expenses = await Expense.find()
      .populate('categoryId')
      .populate('paymentMethodId')
      .populate('personId')
      .sort({ date: -1 });
      
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Expense = getExpenseModel(userDB);
    
    const body = await req.json();
    const expense = await Expense.create(body);
    
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
