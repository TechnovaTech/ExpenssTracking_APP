import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const USERS_FILE = join(process.cwd(), 'users.json');

function loadUsers() {
  if (existsSync(USERS_FILE)) {
    return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
  }
  return [];
}

export async function GET(req: NextRequest) {
  try {
    const users = loadUsers();
    
    const usersWithDbInfo = users.map((user: any) => {
      const userDbId = user.email.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
      return {
        ...user,
        databaseName: `expense_tracker_user_${userDbId}`
      };
    });
    
    return NextResponse.json({ 
      users: usersWithDbInfo,
      total: users.length 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}