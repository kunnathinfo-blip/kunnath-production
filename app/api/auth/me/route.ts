import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const fullUser = await User.findById(user._id);

    if (fullUser) {
      return NextResponse.json({
        _id: fullUser._id,
        name: fullUser.name || '',
        email: fullUser.email || '',
        phoneNumber: fullUser.phoneNumber || '',
        role: fullUser.role,
        isMember: fullUser.isMember,
        membershipType: fullUser.membershipType,
        isVerified: fullUser.isVerified
      });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Me Auth Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error fetching user profile' }, { status: 500 });
  }
}
