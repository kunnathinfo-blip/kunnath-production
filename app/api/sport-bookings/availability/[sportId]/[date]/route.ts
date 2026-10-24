import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';

import Sport from '@/lib/db/models/Sport';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sportId: string; date: string }> }
) {
  try {
    await connectDB();
    const { sportId, date } = await params;

    const sportDoc = await Sport.findById(sportId);

    // Find all active bookings for this sport on this date
    const bookings = await SportBooking.find({
      sport: sportId,
      date: date,
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    const isLapType = sportDoc?.bookingType === 'lap' || sportDoc?.name?.toLowerCase().includes('atv');
    const maxCapacity = sportDoc?.maxCapacityPerSlot || (isLapType ? 7 : 1);

    // Track booked slots and occupancy counts
    const bookedSlots: string[] = [];
    const slotOccupancy: Record<string, number> = {};

    bookings.forEach(b => {
      const count = b.lapsCount || 1;
      const slots = (b.timeSlots && b.timeSlots.length > 0) ? b.timeSlots : (b.timeSlot ? [b.timeSlot] : []);
      slots.forEach((s: string) => {
        slotOccupancy[s] = (slotOccupancy[s] || 0) + count;
      });
    });

    // If occupancy reaches max capacity, mark slot as completely booked
    Object.keys(slotOccupancy).forEach((s) => {
      if (slotOccupancy[s] >= maxCapacity) {
        bookedSlots.push(s);
      }
    });

    // For standard hourly sports, any booking fills the slot
    if (!isLapType) {
      bookings.forEach(b => {
        const slots = (b.timeSlots && b.timeSlots.length > 0) ? b.timeSlots : (b.timeSlot ? [b.timeSlot] : []);
        slots.forEach((s: string) => {
          if (!bookedSlots.includes(s)) bookedSlots.push(s);
        });
      });
    }

    return NextResponse.json({ bookedSlots, slotOccupancy, maxCapacity, isLapType });
  } catch (error: any) {
    console.error('Fetch Sport Availability Error:', error);
    return NextResponse.json({ message: error.message || 'Server error checking availability' }, { status: 500 });
  }
}
