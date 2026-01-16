import { NextRequest, NextResponse } from 'next/server';
import { getUserDB } from '@/lib/mongodb';
import { getPaymentMethodModel } from '@/models/PaymentMethod';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const PaymentMethod = getPaymentMethodModel(userDB);
    
    const methods = await PaymentMethod.find();
    return NextResponse.json(methods);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const PaymentMethod = getPaymentMethodModel(userDB);
    
    const body = await req.json();
    const method = await PaymentMethod.create(body);
    
    return NextResponse.json(method, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
