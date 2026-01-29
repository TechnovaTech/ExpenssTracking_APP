import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXPENSES_FILE = join(process.cwd(), 'expenses.json');
const INCOME_FILE = join(process.cwd(), 'income.json');
const USERS_FILE = join(process.cwd(), 'users.json');
const CATEGORIES_FILE = join(process.cwd(), 'categories.json');
const PERSONS_FILE = join(process.cwd(), 'persons.json');
const PAYMENT_METHODS_FILE = join(process.cwd(), 'payment-methods.json');

function loadFile(filePath: string) {
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  }
  return [];
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const users = loadFile(USERS_FILE);
    const user = users.find((u: any) => u._id === params.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const expenses = loadFile(EXPENSES_FILE);
    const income = loadFile(INCOME_FILE);
    const categories = loadFile(CATEGORIES_FILE);
    const persons = loadFile(PERSONS_FILE);
    const paymentMethods = loadFile(PAYMENT_METHODS_FILE);
    
    const userExpenses = expenses.filter((exp: any) => exp.userEmail === user.email);
    const userIncome = income.filter((inc: any) => inc.userEmail === user.email);
    const userCategories = categories.filter((cat: any) => cat.userEmail === user.email);
    const userPersons = persons.filter((person: any) => person.userEmail === user.email);
    const userPaymentMethods = paymentMethods.filter((pm: any) => pm.userEmail === user.email);
    
    return NextResponse.json({ 
      user,
      expenses: userExpenses,
      income: userIncome,
      categories: userCategories,
      persons: userPersons,
      paymentMethods: userPaymentMethods
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}