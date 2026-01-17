import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXPENSES_FILE = join(process.cwd(), 'expenses.json');
const INCOME_FILE = join(process.cwd(), 'income.json');

function loadExpenses() {
  if (existsSync(EXPENSES_FILE)) {
    return JSON.parse(readFileSync(EXPENSES_FILE, 'utf-8'));
  }
  return [];
}

function loadIncome() {
  if (existsSync(INCOME_FILE)) {
    return JSON.parse(readFileSync(INCOME_FILE, 'utf-8'));
  }
  return [];
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json({ message: 'User email required' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const expenses = loadExpenses();
    const income = loadIncome();

    const userExpenses = expenses.filter((exp: any) => exp.userEmail === userEmail);
    const userIncome = income.filter((inc: any) => inc.userEmail === userEmail);

    const totalExpenses = userExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const totalIncome = userIncome.reduce((sum: number, inc: any) => sum + inc.amount, 0);
    const balance = totalIncome - totalExpenses;

    return NextResponse.json({ 
      totalIncome,
      totalExpenses,
      balance,
      expenseCount: userExpenses.length,
      incomeCount: userIncome.length
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to calculate balance' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}