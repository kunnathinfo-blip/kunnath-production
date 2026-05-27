import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sportId: string; date: string }> }
) {
  try {
    await connectDB();
    const { sportId, date } = await params;

    // Find all active bookings for this sport on this date
    const bookings = await SportBooking.find({
      sport: sportId,
      date: date,
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    // Flatten all booked time slots
    const bookedSlots: string[] = [];
    bookings.forEach(b => {
      if (b.timeSlots && b.timeSlots.length > 0) {
        bookedSlots.push(...b.timeSlots);
      } else if (b.timeSlot) {
        bookedSlots.push(b.timeSlot);
      }
    });

    return NextResponse.json({ bookedSlots });
  } catch (error: any) {
    console.error('Fetch Sport Availability Error:', error);
    return NextResponse.json({ message: error.message || 'Server error checking availability' }, { status: 500 });
  }
}
