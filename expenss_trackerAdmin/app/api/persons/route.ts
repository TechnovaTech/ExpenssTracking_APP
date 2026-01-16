import { NextRequest, NextResponse } from 'next/server';
import { getUserDB } from '@/lib/mongodb';
import { getPersonModel } from '@/models/Person';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Person = getPersonModel(userDB);
    
    const persons = await Person.find();
    return NextResponse.json(persons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDB = getUserDB(userId);
    const Person = getPersonModel(userDB);
    
    const body = await req.json();
    const person = await Person.create(body);
    
    return NextResponse.json(person, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
