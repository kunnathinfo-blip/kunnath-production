import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { name, email, password, aadhaarNumber } = await req.json();

    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (email && email !== dbUser.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailTaken) {
        return NextResponse.json({ message: 'Email already registered with another account' }, { status: 400 });
      }
      dbUser.email = email;
    }

    if (name) {
      dbUser.name = name;
    }

    if (password) {
      dbUser.password = password;
    }

    if (aadhaarNumber) {
      const cleanedAadhaar = aadhaarNumber.replace(/\D/g, '');
      if (cleanedAadhaar.length !== 12) {
        return NextResponse.json({ message: 'Aadhaar Card Number must be exactly 12 digits' }, { status: 400 });
      }
      dbUser.aadhaarNumber = cleanedAadhaar;
    }

    await dbUser.save();

    return NextResponse.json({
      success: true,
      user: {
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        phoneNumber: dbUser.phoneNumber,
        role: dbUser.role,
        isMember: dbUser.isMember,
        membershipType: dbUser.membershipType,
        isVerified: dbUser.isVerified
      }
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error updating profile' }, { status: 500 });
  }
}
