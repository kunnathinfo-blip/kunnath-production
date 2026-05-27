import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';
// Import Sport model to ensure it is registered for populate
import '@/lib/db/models/Sport';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const bookings = await SportBooking.find({ user: user._id })
      .populate('sport', 'name image icon')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Fetch My Sport Bookings Error:', error);
    return NextResponse.json({ message: error.message || 'Server error fetching sport bookings' }, { status: 500 });
  }
}
