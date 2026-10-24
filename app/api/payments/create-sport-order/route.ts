import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import Sport from '@/lib/db/models/Sport';
import SportBooking from '@/lib/db/models/SportBooking';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { getRazorpayInstance } from '@/lib/payments/razorpay';
import { validateCouponBackend } from '@/lib/db/utils/couponHelper';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { sportId, date, timeSlots, duration, userDetails, couponCode, lapsCount } = await req.json();

    if (!sportId || !date || !timeSlots || !userDetails || !userDetails.name || !userDetails.email || !userDetails.phone) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    // Get the sport to calculate server-side pricing and rules
    const sportDoc = await Sport.findById(sportId);
    if (!sportDoc) {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }

    const isLapType = sportDoc.bookingType === 'lap' || sportDoc.name?.toLowerCase().includes('atv');
    const finalLaps = isLapType ? Math.max(1, Math.min(10, lapsCount || 1)) : 1;
    const finalDuration = isLapType ? 1 : duration;

    if (!isLapType) {
      // Validate duration for hourly sports
      if (finalDuration < 1 || finalDuration > 3) {
        return NextResponse.json({ message: 'Duration must be 1, 2, or 3 hours' }, { status: 400 });
      }

      // Validate timeSlots array
      if (!Array.isArray(timeSlots) || timeSlots.length !== finalDuration) {
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
    }

    // Check for overlapping bookings and capacity
    const existingBookings = await SportBooking.find({
      sport: sportId,
      date,
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    if (isLapType) {
      const maxPerSlot = sportDoc.maxCapacityPerSlot || 7;
      const targetSlot = timeSlots[0];
      let currentBookedLaps = 0;

      existingBookings.forEach(b => {
        const slots = (b.timeSlots && b.timeSlots.length > 0) ? b.timeSlots : (b.timeSlot ? [b.timeSlot] : []);
        if (slots.includes(targetSlot)) {
          currentBookedLaps += (b.lapsCount || 1);
        }
      });

      if (currentBookedLaps + finalLaps > maxPerSlot) {
        const remaining = Math.max(0, maxPerSlot - currentBookedLaps);
        return NextResponse.json({
          message: remaining === 0
            ? 'This 15-minute slot is fully booked. Please select another slot.'
            : `Only ${remaining} lap(s) available in this slot.`
        }, { status: 400 });
      }
    } else {
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
    }

    let finalPrice = isLapType ? (sportDoc.price * finalLaps) : (sportDoc.price * finalDuration);

    // Apply Coupon Discount
    let couponId = undefined;
    let couponCodeApplied = undefined;
    let originalAmount = finalPrice;
    let discountAmount = 0;

    if (couponCode) {
      try {
        const validation = await validateCouponBackend({
          code: couponCode,
          bookingType: 'sport',
          bookingAmount: finalPrice,
          userId: user._id,
        });
        couponId = validation.coupon._id;
        couponCodeApplied = validation.coupon.code;
        discountAmount = validation.discountAmount;
        finalPrice = validation.finalAmount;
      } catch (err: any) {
        return NextResponse.json({ message: err.message || 'Invalid coupon code' }, { status: 400 });
      }
    }

    const amountInPaise = Math.round(finalPrice * 100);

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
      duration: finalDuration,
      lapsCount: finalLaps,
      timeSlot: timeSlots[0], // Backward compatibility
      totalPrice: finalPrice,
      userDetails,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes hold
      couponId,
      couponCode: couponCodeApplied,
      originalAmount,
      discountAmount,
      finalAmount: finalPrice,
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      order,
      bookingId: booking._id,
      totalPrice: finalPrice
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in createSportOrder:', error);
    return NextResponse.json({ message: error.message || 'Server error while creating order' }, { status: 500 });
  }
}
