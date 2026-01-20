import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PERSONS_FILE = join(process.cwd(), 'persons.json');

function loadPersons() {
  if (existsSync(PERSONS_FILE)) {
    return JSON.parse(readFileSync(PERSONS_FILE, 'utf-8'));
  }
  return [];
}

function savePersons(persons: any[]) {
  writeFileSync(PERSONS_FILE, JSON.stringify(persons, null, 2));
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
    const { userEmail, person } = await request.json();

    if (!userEmail || !person) {
      return NextResponse.json({ message: 'Missing required fields' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const persons = loadPersons();
    const existingPerson = persons.find((p: any) => 
      p.userEmail === userEmail.toLowerCase().trim() && p.name === person
    );

    if (!existingPerson) {
      const newPerson = {
        id: Date.now().toString(),
        userEmail: userEmail.toLowerCase().trim(),
        name: person,
        createdAt: new Date().toISOString()
      };

      persons.push(newPerson);
      savePersons(persons);
    }

    return NextResponse.json({ 
      message: 'Person saved successfully'
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to save person' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail')?.toLowerCase().trim();

    const persons = loadPersons();
    const userPersons = userEmail 
      ? persons.filter((p: any) => p.userEmail === userEmail)
      : persons;

    return NextResponse.json({ 
      persons: userPersons.map((p: any) => p.name)
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get persons' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}