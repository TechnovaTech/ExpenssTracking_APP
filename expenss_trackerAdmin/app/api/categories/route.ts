import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CATEGORIES_FILE = join(process.cwd(), 'categories.json');

function loadCategories() {
  if (existsSync(CATEGORIES_FILE)) {
    return JSON.parse(readFileSync(CATEGORIES_FILE, 'utf-8'));
  }
  return [];
}

function saveCategories(categories: any[]) {
  writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
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
    const { userEmail, category } = await request.json();

    if (!userEmail || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const categories = loadCategories();
    const existingCategory = categories.find((c: any) => 
      c.userEmail === userEmail.toLowerCase().trim() && c.name === category
    );

    if (!existingCategory) {
      const newCategory = {
        id: Date.now().toString(),
        userEmail: userEmail.toLowerCase().trim(),
        name: category,
        createdAt: new Date().toISOString()
      };

      categories.push(newCategory);
      saveCategories(categories);
    }

    return NextResponse.json({ 
      message: 'Category saved successfully'
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to save category' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    const categories = loadCategories();
    const userCategories = userEmail 
      ? categories.filter((c: any) => c.userEmail === userEmail)
      : categories;

    return NextResponse.json({ 
      categories: userCategories.map((c: any) => c.name)
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get categories' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}