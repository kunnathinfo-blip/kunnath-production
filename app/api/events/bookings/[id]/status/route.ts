import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventBooking from '@/lib/db/models/EventBooking';
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
    const { status } = await req.json();
    const booking = await EventBooking.findById(id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      return NextResponse.json(updatedBooking);
    } else {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Update Event Booking Status Error:', error);
    return NextResponse.json({ message: 'Server Error updating booking status', error: error.message }, { status: 500 });
  }
}
