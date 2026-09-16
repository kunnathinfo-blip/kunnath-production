import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import FarmStay from '@/lib/db/models/FarmStay';
import EventBooking from '@/lib/db/models/EventBooking';
import BlockedDate from '@/lib/db/models/BlockedDate';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { getRazorpayInstance } from '@/lib/payments/razorpay';
import { parseUTCDate } from '@/lib/utils';
import { EVENT_PRICING_DETAILS } from '@/lib/constants/events';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const {
      stayId,
      date,
      gatheringSize,
      eventType,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      termsAccepted
    } = await req.json();

    if (!stayId || !date || !gatheringSize || !guestName || !guestPhone) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    if (termsAccepted !== true) {
      return NextResponse.json({ message: 'You must accept the booking and payment terms to proceed' }, { status: 400 });
    }

    const eventDate = parseUTCDate(date);

    // Enforce 90-day booking restriction from today (IST timezone check)
    const todayISTStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayIST = new Date(todayISTStr + 'T00:00:00.000Z');
    const maxBookingDate = new Date(todayIST.getTime() + 90 * 24 * 60 * 60 * 1000);

    if (eventDate < todayIST) {
      return NextResponse.json({ message: 'Booking date cannot be in the past' }, { status: 400 });
    }

    if (eventDate > maxBookingDate) {
      return NextResponse.json({ message: 'Event bookings are restricted to a maximum of 90 days from the current date.' }, { status: 400 });
    }

    const nextDay = new Date(eventDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    // 1. Check for overlapping Stay bookings for this property
    const overlappingStay = await Booking.findOne({
      stayId,
      checkIn: { $lt: nextDay },
      checkOut: { $gt: eventDate },
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    if (overlappingStay) {
      return NextResponse.json({
        message: 'This venue is already booked for a Stay on the selected date.'
      }, { status: 400 });
    }

    // 2. Check for overlapping Event bookings for this property
    const overlappingEvent = await EventBooking.findOne({
      stayId,
      date: eventDate,
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    if (overlappingEvent) {
      return NextResponse.json({
        message: 'This venue is already booked for an Event on the selected date.'
      }, { status: 400 });
    }

    // 3. Check for overlapping Admin Blocked Dates
    const overlappingBlock = await BlockedDate.findOne({
      stayId,
      startDate: { $lt: nextDay },
      endDate: { $gt: eventDate }
    });

    if (overlappingBlock) {
      return NextResponse.json({
        message: 'This venue is blocked by administration for the selected date.'
      }, { status: 400 });
    }

    // Fetch stay to validate property and compute price
    const stay = await FarmStay.findById(stayId);
    if (!stay) {
      return NextResponse.json({ message: 'Farm stay venue not found' }, { status: 404 });
    }

    const stayKey = (stay.name || '').toLowerCase().trim();
    const eventPricing = EVENT_PRICING_DETAILS[stayKey];

    if (!eventPricing) {
      return NextResponse.json({ message: 'Event pricing not configured for this venue' }, { status: 400 });
    }

    // Find the pricing tier matching gatheringSize
    const selectedTier = eventPricing.tiers.find(
      t => t.label.trim().toLowerCase() === gatheringSize.trim().toLowerCase()
    );

    if (!selectedTier) {
      return NextResponse.json({ message: 'Invalid gathering size selected for this venue' }, { status: 400 });
    }

    const finalPrice = selectedTier.price;
    const securityDeposit = eventPricing.securityDeposit || 10000;
    const amountInPaise = Math.round(finalPrice * 100);

    const razorpay = getRazorpayInstance();
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcp_event_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ message: 'Failed to create Razorpay order' }, { status: 500 });
    }

    // Create a pending EventBooking with a 3-minute temporary hold
    const booking = new EventBooking({
      userId: user._id,
      stayId,
      date: eventDate,
      guests: 1,
      gatheringSize: selectedTier.label,
      eventType: eventType || 'Celebration',
      totalPrice: finalPrice,
      securityDeposit,
      termsAccepted: true,
      guestName,
      guestEmail: guestEmail || user.email || 'no-email@kunnath.com',
      guestPhone,
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes temporary hold
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      order,
      bookingId: booking._id,
      finalPrice,
      securityDeposit,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in createEventOrder:', error);
    return NextResponse.json({ message: error.message || 'Server error while creating event order' }, { status: 500 });
  }
}
