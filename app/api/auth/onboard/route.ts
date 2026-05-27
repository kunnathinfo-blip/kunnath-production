import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { name, aadhaarNumber } = await req.json();

    if (!name || !aadhaarNumber) {
      return NextResponse.json({ message: 'Full Name and Aadhaar Card Number are required' }, { status: 400 });
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      return NextResponse.json({ message: 'Aadhaar Card Number must be exactly 12 digits' }, { status: 400 });
    }

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    dbUser.name = name;
    dbUser.aadhaarNumber = cleanedAadhaar;
    dbUser.isVerified = true;

    await dbUser.save();

    return NextResponse.json({
      _id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      phoneNumber: dbUser.phoneNumber,
      role: dbUser.role,
      isMember: dbUser.isMember,
      membershipType: dbUser.membershipType,
      isVerified: dbUser.isVerified
    });
  } catch (error: any) {
    console.error('Onboard Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error during onboarding' }, { status: 500 });
  }
}
