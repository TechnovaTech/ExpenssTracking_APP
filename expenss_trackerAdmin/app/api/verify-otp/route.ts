import { NextResponse } from 'next/server';
import { getOtp, deleteOtp, otpStore } from '@/lib/otpStore';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const USERS_FILE = join(process.cwd(), 'users.json');

function loadUsers() {
  if (existsSync(USERS_FILE)) {
    return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
  }
  return [];
}

function saveUsers(users: any[]) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    const normalizedEmail = email?.toLowerCase().trim();

    console.log(`🔍 Verifying OTP for: ${normalizedEmail}, OTP: ${otp}`);
    console.log('📦 Current OTP Store:', Array.from(otpStore.entries()));

    if (!normalizedEmail || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const storedData = getOtp(normalizedEmail);

    if (!storedData) {
      return NextResponse.json({ message: 'OTP not found or expired' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (Date.now() > storedData.expiresAt) {
      deleteOtp(normalizedEmail);
      return NextResponse.json({ message: 'OTP expired' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (storedData.otp === otp) {
      deleteOtp(normalizedEmail);
      
      // Create user entry in JSON file
      try {
        const users = loadUsers();
        const existingUser = users.find((u: any) => u.email === normalizedEmail);
        
        if (!existingUser) {
          const userName = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
          const userDbId = normalizedEmail.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
          const newUser = {
            _id: Date.now().toString(),
            name: userName,
            email: normalizedEmail,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          users.push(newUser);
          saveUsers(users);
          console.log(`✅ New user registered: ${userName} (${normalizedEmail}) - DB: expense_tracker_user_${userDbId}`);
        } else {
          const userDbId = normalizedEmail.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
          console.log(`✅ Existing user logged in: ${existingUser.name} (${normalizedEmail}) - DB: expense_tracker_user_${userDbId}`);
        }
      } catch (dbError) {
        console.error('❌ File error:', dbError);
      }
      
      return NextResponse.json({ message: 'OTP verified successfully', success: true }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    return NextResponse.json({ message: 'Invalid OTP' }, { 
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    console.error('❌ Verify error:', error);
    return NextResponse.json({ message: 'Verification failed', error: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
