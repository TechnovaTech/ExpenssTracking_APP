import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PAYMENT_METHODS_FILE = join(process.cwd(), 'payment-methods.json');

function loadPaymentMethods() {
  if (existsSync(PAYMENT_METHODS_FILE)) {
    return JSON.parse(readFileSync(PAYMENT_METHODS_FILE, 'utf-8'));
  }
  return [];
}

function savePaymentMethods(paymentMethods: any[]) {
  writeFileSync(PAYMENT_METHODS_FILE, JSON.stringify(paymentMethods, null, 2));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { userEmail, paymentMethod } = await request.json();

    if (!userEmail || !paymentMethod) {
      return NextResponse.json({ message: 'Missing required fields' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const paymentMethods = loadPaymentMethods();
    const existingMethod = paymentMethods.find((pm: any) => 
      pm.userEmail === userEmail.toLowerCase().trim() && pm.name === paymentMethod
    );

    if (!existingMethod) {
      const newPaymentMethod = {
        id: Date.now().toString(),
        userEmail: userEmail.toLowerCase().trim(),
        name: paymentMethod,
        createdAt: new Date().toISOString()
      };

      paymentMethods.push(newPaymentMethod);
      savePaymentMethods(paymentMethods);
    }

    return NextResponse.json({ 
      message: 'Payment method saved successfully'
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to save payment method' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    const paymentMethods = loadPaymentMethods();
    const userPaymentMethods = userEmail 
      ? paymentMethods.filter((pm: any) => pm.userEmail === userEmail)
      : paymentMethods;

    return NextResponse.json({ 
      paymentMethods: userPaymentMethods.map((pm: any) => pm.name)
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get payment methods' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}