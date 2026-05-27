import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { checkAdmin } from '@/lib/auth/protect';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id } = await params;
    const { membershipType, isMember } = await req.json();
    const user = await User.findById(id);

    if (user) {
      user.membershipType = membershipType;
      user.isMember = isMember;

      const updatedUser = await user.save();
      return NextResponse.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isMember: updatedUser.isMember,
        membershipType: updatedUser.membershipType
      });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Update Membership Error:', error);
    return NextResponse.json({ message: 'Error updating membership', error: error.message }, { status: 500 });
  }
}
