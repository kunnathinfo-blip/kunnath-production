import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventBooking from '@/lib/db/models/EventBooking';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const count = await EventBooking.countDocuments({ isRead: false });
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Fetch Unread Event Bookings Count Error:', error);
    return NextResponse.json({ message: 'Server Error fetching count', error: error.message }, { status: 500 });
  }
}
