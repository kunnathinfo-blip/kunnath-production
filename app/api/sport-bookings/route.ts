import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import SportBooking from '@/lib/db/models/SportBooking';
import Sport from '@/lib/db/models/Sport';
import Booking from '@/lib/db/models/Booking';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { sport, date, timeSlots, duration, userDetails } = await req.json();

    // Validate duration
    if (!duration || duration < 1 || duration > 3) {
      return NextResponse.json({ message: 'Duration must be 1, 2, or 3 hours' }, { status: 400 });
    }

    // Validate timeSlots array
    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length !== duration) {
      return NextResponse.json({ message: 'Time slots must match the selected duration' }, { status: 400 });
    }

    // Validate slots are consecutive
    for (let i = 1; i < timeSlots.length; i++) {
      const prevHour = parseInt(timeSlots[i - 1].split(':')[0]);
      const currHour = parseInt(timeSlots[i].split(':')[0]);
      if (currHour !== prevHour + 1) {
        return NextResponse.json({ message: 'Time slots must be consecutive hours' }, { status: 400 });
      }
    }

    // Verify user has an active stay booking
    const stayBooking = await Booking.findOne({
      userId: user._id,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    if (!stayBooking) {
      return NextResponse.json({ 
        message: 'To book sports slots, please book a stay first or contact us for assistance.',
        requiresStay: true
      }, { status: 403 });
    }

    // Check for overlapping bookings
    const existingBookings = await SportBooking.find({
      sport,
      date,
      status: { $ne: 'cancelled' }
    });

    // Flatten all currently booked slots
    const alreadyBooked: string[] = [];
    existingBookings.forEach(b => {
      if (b.timeSlots && b.timeSlots.length > 0) {
        alreadyBooked.push(...b.timeSlots);
      } else if (b.timeSlot) {
        alreadyBooked.push(b.timeSlot);
      }
    });

    // Check if any requested slot is already booked
    const conflicting = timeSlots.filter(slot => alreadyBooked.includes(slot));
    if (conflicting.length > 0) {
      return NextResponse.json({ 
        message: `The following slots are already booked: ${conflicting.join(', ')}` 
      }, { status: 400 });
    }

    // Get the sport to calculate server-side pricing
    const sportDoc = await Sport.findById(sport);
    if (!sportDoc) {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }

    const totalPrice = sportDoc.price * duration;

    const booking = new SportBooking({
      user: user._id,
      sport,
      date,
      timeSlots,
      duration,
      timeSlot: timeSlots[0], // Backward compatibility
      totalPrice,
      userDetails
    });

    const createdBooking = await booking.save();
    return NextResponse.json(createdBooking, { status: 201 });
  } catch (error: any) {
    console.error('Create Sport Booking Error:', error);
    return NextResponse.json({ message: error.message || 'Server error creating sport booking' }, { status: 500 });
  }
}
