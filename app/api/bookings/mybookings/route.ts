import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
// Import FarmStay model to ensure the ref is registered before populate runs
import '@/lib/db/models/FarmStay';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const bookings = await Booking.find({ userId: user._id }).populate('stayId', 'name images price');
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Fetch My Bookings Error:', error);
    return NextResponse.json({ message: error.message || 'Server error while fetching bookings' }, { status: 500 });
  }
}
