import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import FarmStay from '@/lib/db/models/FarmStay';
import BlockedDate from '@/lib/db/models/BlockedDate';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { getRazorpayInstance } from '@/lib/payments/razorpay';
import { parseUTCDate } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { stayId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, selectedAddOns, termsAccepted } = await req.json();

    if (!stayId || !checkIn || !checkOut || !guests || !guestName || !guestPhone) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    if (termsAccepted !== true) {
      return NextResponse.json({ message: 'You must accept the booking and payment terms to proceed' }, { status: 400 });
    }

    const checkInDate = parseUTCDate(checkIn);
    const checkOutDate = parseUTCDate(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ message: 'Check-out date must be after check-in date' }, { status: 400 });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      stayId,
      $and: [
        { checkIn: { $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate } }
      ],
      $or: [
        { status: 'confirmed' }, // Confirmed bookings block the slot
        { status: 'pending', expiresAt: { $gt: new Date() } } // Active pending bookings block the slot
      ]
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json({ message: 'These dates are already booked for this stay' }, { status: 400 });
    }

    // Check for overlapping blocked dates
    const overlappingBlocks = await BlockedDate.find({
      stayId,
      startDate: { $lt: checkOutDate },
      endDate: { $gt: checkInDate }
    });

    if (overlappingBlocks.length > 0) {
      return NextResponse.json({ message: 'These dates are blocked by the administrator for stay maintenance or private events' }, { status: 400 });
    }

    const stay = await FarmStay.findById(stayId);
    if (!stay) {
      return NextResponse.json({ message: 'Farm stay not found' }, { status: 404 });
    }

    // Server-side Pricing Validation
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate weekend vs weekday nights accurately
    let weekdayNights = 0;
    let weekendNights = 0;
    let current = new Date(checkInDate);
    while (current < checkOutDate) {
      const day = current.getUTCDay();
      if (day === 6 || day === 0) { // Saturday or Sunday
        weekendNights++;
      } else {
        weekdayNights++;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    const basePrice = (weekdayNights * stay.price) + (weekendNights * (stay.weekendPrice || stay.price));

    const extraGuests = guests > stay.capacity ? guests - stay.capacity : 0;
    const extraGuestTotal = extraGuests * (stay.extraGuestCharge || 0) * nights;

    let addOnsTotal = 0;
    if (selectedAddOns && selectedAddOns.length > 0 && stay.addOns) {
      addOnsTotal = stay.addOns
        .filter((a: any) => selectedAddOns.includes(a.name))
        .reduce((sum: number, a: any) => sum + a.price, 0);
    }

    let finalPrice = basePrice + extraGuestTotal + addOnsTotal;

    // Apply Membership Discount
    if (user.isMember) {
      let discountPercent = 0;
      if (user.membershipType === 'silver') discountPercent = 10;
      else if (user.membershipType === 'gold') discountPercent = 20;
      else if (user.membershipType === 'premium') discountPercent = 30;
      finalPrice -= (basePrice * discountPercent) / 100;
    }

    // 50% Upfront stay booking policy
    const upfrontAmountPaid = Math.round(finalPrice * 0.5);
    const amountDueAtCheckIn = finalPrice - upfrontAmountPaid;
    const securityDeposit = 5000;

    const amountInPaise = Math.round(upfrontAmountPaid * 100);

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcp_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ message: 'Failed to create Razorpay order' }, { status: 500 });
    }

    // Create a pending booking in our database
    const booking = new Booking({
      userId: user._id,
      stayId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice: finalPrice,
      upfrontAmountPaid,
      amountDueAtCheckIn,
      securityDeposit,
      termsAccepted: true,
      securityDepositStatus: 'pending',
      guestName,
      guestEmail: guestEmail || 'no-email@kunnath.com',
      guestPhone,
      selectedAddOns: selectedAddOns || [],
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
      finalPrice,
      upfrontAmountPaid,
      amountDueAtCheckIn,
      securityDeposit
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in createOrder:', error);
    return NextResponse.json({ message: error.message || 'Server error while creating order' }, { status: 500 });
  }
}
