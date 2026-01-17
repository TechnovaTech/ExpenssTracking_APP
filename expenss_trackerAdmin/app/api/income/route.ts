import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const INCOME_FILE = join(process.cwd(), 'income.json');

function loadIncome() {
  if (existsSync(INCOME_FILE)) {
    return JSON.parse(readFileSync(INCOME_FILE, 'utf-8'));
  }
  return [];
}

function saveIncome(income: any[]) {
  writeFileSync(INCOME_FILE, JSON.stringify(income, null, 2));
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
    const { userEmail, amount, category, person, paymentMethod, description, date } = await request.json();

    if (!userEmail || !amount || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const income = loadIncome();
    const newIncome = {
      id: Date.now().toString(),
      userEmail: userEmail.toLowerCase().trim(),
      amount: parseFloat(amount),
      category,
      person: person || '',
      paymentMethod: paymentMethod || '',
      description: description || '',
      date: date || new Date().toISOString(),
      type: 'income',
      createdAt: new Date().toISOString()
    };

    income.push(newIncome);
    saveIncome(income);

    console.log(`💰 Income added: ${userEmail} - ₹${amount} from ${category}`);

    return NextResponse.json({ 
      message: 'Income added successfully',
      income: newIncome 
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    console.error('❌ Income error:', error);
    return NextResponse.json({ message: 'Failed to add income' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    const income = loadIncome();
    const userIncome = userEmail 
      ? income.filter((inc: any) => inc.userEmail === userEmail)
      : income;

    return NextResponse.json({ 
      income: userIncome,
      total: userIncome.length 
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get income' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}