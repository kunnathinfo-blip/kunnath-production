import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import Sport from '@/lib/db/models/Sport';
import SportBooking from '@/lib/db/models/SportBooking';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { getRazorpayInstance } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { sportId, date, timeSlots, duration, userDetails } = await req.json();

    if (!sportId || !date || !timeSlots || !duration || !userDetails || !userDetails.name || !userDetails.email || !userDetails.phone) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    // Validate duration
    if (duration < 1 || duration > 3) {
      return NextResponse.json({ message: 'Duration must be 1, 2, or 3 hours' }, { status: 400 });
    }

    // Validate timeSlots array
    if (!Array.isArray(timeSlots) || timeSlots.length !== duration) {
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
      sport: sportId,
      date,
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
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
    const sportDoc = await Sport.findById(sportId);
    if (!sportDoc) {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }

    const totalPrice = sportDoc.price * duration;
    const amountInPaise = Math.round(totalPrice * 100);

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcp_sport_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ message: 'Failed to create Razorpay order' }, { status: 500 });
    }

    // Create a pending booking in our database
    const booking = new SportBooking({
      user: user._id,
      sport: sportId,
      date,
      timeSlots,
      duration,
      timeSlot: timeSlots[0], // Backward compatibility
      totalPrice,
      userDetails,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000) // 3 minutes hold
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      order,
      bookingId: booking._id,
      totalPrice
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in createSportOrder:', error);
    return NextResponse.json({ message: error.message || 'Server error while creating order' }, { status: 500 });
  }
}
