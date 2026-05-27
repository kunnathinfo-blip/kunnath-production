import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { setAuthCookie } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      await setAuthCookie(user._id.toString());
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isMember: user.isMember,
        membershipType: user.membershipType
      });
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error during login' }, { status: 500 });
  }
}
