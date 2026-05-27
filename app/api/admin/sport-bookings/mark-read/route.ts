import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';
import { checkAdmin } from '@/lib/auth/protect';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    await SportBooking.updateMany({ isRead: false }, { $set: { isRead: true } });
    return NextResponse.json({ message: 'All sport bookings marked as read' });
  } catch (error: any) {
    console.error('Admin Mark Sport Bookings Read Error:', error);
    return NextResponse.json({ message: 'Error marking sport bookings as read', error: error.message }, { status: 500 });
  }
}
