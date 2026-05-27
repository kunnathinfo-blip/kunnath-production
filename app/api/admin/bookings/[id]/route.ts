import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
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
    const body = await req.json();
    const booking = await Booking.findById(id);

    if (booking) {
      booking.status = body.status || booking.status;
      const updatedBooking = await booking.save();
      return NextResponse.json(updatedBooking);
    } else {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Update Booking Error:', error);
    return NextResponse.json({ message: 'Error updating booking', error: error.message }, { status: 500 });
  }
}

export async function DELETE(
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
    const booking = await Booking.findByIdAndDelete(id);

    if (booking) {
      return NextResponse.json({ message: 'Booking removed' });
    } else {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Delete Booking Error:', error);
    return NextResponse.json({ message: 'Error deleting booking', error: error.message }, { status: 500 });
  }
}
