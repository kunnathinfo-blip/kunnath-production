import { NextRequest, NextResponse } from 'next/server';
import otpService from '@/lib/services/otpService';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber || phoneNumber.length < 10) {
      return NextResponse.json({ message: 'Please enter a valid 10-digit phone number' }, { status: 400 });
    }
    
    // Extract last 10 digits
    const cleanedPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanedPhone.length !== 10) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }
    
    await otpService.sendOtp(cleanedPhone);
    return NextResponse.json({ success: true, message: 'OTP sent successfully (mock mode)' });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error sending OTP' }, { status: 500 });
  }
}
