import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
// Register dependencies for populate
import '@/lib/db/models/User';
import '@/lib/db/models/FarmStay';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('stayId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Admin Fetch Bookings Error:', error);
    return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
  }
}
