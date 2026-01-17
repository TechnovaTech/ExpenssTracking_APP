import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXPENSES_FILE = join(process.cwd(), 'expenses.json');

function loadExpenses() {
  if (existsSync(EXPENSES_FILE)) {
    return JSON.parse(readFileSync(EXPENSES_FILE, 'utf-8'));
  }
  return [];
}

function saveExpenses(expenses: any[]) {
  writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
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

    const expenses = loadExpenses();
    const newExpense = {
      id: Date.now().toString(),
      userEmail: userEmail.toLowerCase().trim(),
      amount: parseFloat(amount),
      category,
      person: person || '',
      paymentMethod: paymentMethod || '',
      description: description || '',
      date: date || new Date().toISOString(),
      type: 'expense',
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    console.log(`💸 Expense added: ${userEmail} - ₹${amount} for ${category}`);

    return NextResponse.json({ 
      message: 'Expense added successfully',
      expense: newExpense 
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    console.error('❌ Expense error:', error);
    return NextResponse.json({ message: 'Failed to add expense' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    const expenses = loadExpenses();
    const userExpenses = userEmail 
      ? expenses.filter((exp: any) => exp.userEmail === userEmail)
      : expenses;

    return NextResponse.json({ 
      expenses: userExpenses,
      total: userExpenses.length 
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get expenses' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}