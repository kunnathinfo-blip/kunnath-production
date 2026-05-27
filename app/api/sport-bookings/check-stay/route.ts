import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const stayBooking = await Booking.findOne({
      userId: user._id,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    return NextResponse.json({ hasStayBooking: !!stayBooking });
  } catch (error: any) {
    console.error('Check User Stay Booking Error:', error);
    return NextResponse.json({ message: error.message || 'Server error checking stay booking' }, { status: 500 });
  }
}
