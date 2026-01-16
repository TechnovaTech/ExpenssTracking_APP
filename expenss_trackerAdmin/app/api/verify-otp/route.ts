import { NextResponse } from 'next/server';
import { getOtp, deleteOtp, otpStore } from '@/lib/otpStore';

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
