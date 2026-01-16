import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { setOtp, otpStore } from '@/lib/otpStore';

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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setOtp(normalizedEmail, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Expense Tracker OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #6C63FF; text-align: center;">Expense Tracker</h2>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Your OTP for login is:</p>
            <div style="background-color: #f5f5f5; color: #000000; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">Expense Tracker App</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${normalizedEmail}: ${otp}`);
    console.log('📦 Current OTP Store:', Array.from(otpStore.entries()));
    return NextResponse.json({ message: 'OTP sent successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('❌ Email error:', error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
