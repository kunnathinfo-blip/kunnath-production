import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';
// Register dependency models for population
import '@/lib/db/models/User';
import '@/lib/db/models/Sport';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const bookings = await SportBooking.find({})
      .populate('user', 'name email')
      .populate('sport', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Admin Fetch Sport Bookings Error:', error);
    return NextResponse.json({ message: 'Error fetching sport bookings', error: error.message }, { status: 500 });
  }
}
