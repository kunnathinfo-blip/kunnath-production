import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import FarmStay from '@/lib/db/models/FarmStay';
import BlockedDate from '@/lib/db/models/BlockedDate';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { parseUTCDate } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { stayId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, selectedAddOns } = await req.json();

    if (!stayId || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    const checkInDate = parseUTCDate(checkIn);
    const checkOutDate = parseUTCDate(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ message: 'Check-out date must be after check-in date' }, { status: 400 });
    }

    // Enforce 90-day booking restriction from today (IST timezone check)
    const todayISTStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayIST = new Date(todayISTStr + 'T00:00:00.000Z');
    const maxBookingDate = new Date(todayIST.getTime() + 90 * 24 * 60 * 60 * 1000);

    if (checkInDate > maxBookingDate) {
      return NextResponse.json({ message: 'Stay bookings are restricted to a maximum of 90 days from the current date.' }, { status: 400 });
    }

    // Check for overlapping bookings for this stay
    const overlappingBookings = await Booking.find({
      stayId,
      status: { $ne: 'cancelled' },
      $and: [
        { checkIn: { $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate } }
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

    // Secure Pricing Logic
    const stay = await FarmStay.findById(stayId);
    if (!stay) {
      return NextResponse.json({ message: 'Farm stay not found' }, { status: 404 });
    }

    // Calculate nights
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate base price day by day (taking weekend vs weekday prices into account if stay lists weekendPrice)
    let basePrice = 0;
    let tempDate = new Date(checkInDate);
    for (let i = 0; i < nights; i++) {
      const day = tempDate.getUTCDay();
      // Saturday (6) and Sunday (0) are weekend days
      const isWeekend = day === 6 || day === 0;
      basePrice += isWeekend && stay.weekendPrice ? stay.weekendPrice : stay.price;
      tempDate.setUTCDate(tempDate.getUTCDate() + 1);
    }

    // Extra guest charges
    const extraGuests = guests > stay.capacity ? guests - stay.capacity : 0;
    const extraGuestTotal = extraGuests * (stay.extraGuestCharge || 0) * nights;

    // Add-on charges
    let addOnsTotal = 0;
    if (selectedAddOns && selectedAddOns.length > 0 && stay.addOns) {
      addOnsTotal = stay.addOns
        .filter((a: any) => selectedAddOns.includes(a.name))
        .reduce((sum: number, a: any) => sum + a.price, 0);
    }

    let finalPrice = basePrice + extraGuestTotal + addOnsTotal;

    // Apply Membership Discount (on base price only)
    if (user.isMember) {
      let discountPercent = 0;
      if (user.membershipType === 'silver') discountPercent = 10;
      else if (user.membershipType === 'gold') discountPercent = 20;
      else if (user.membershipType === 'premium') discountPercent = 30;
      finalPrice -= (basePrice * discountPercent) / 100;
    }

    const booking = new Booking({
      userId: user._id,
      stayId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice: finalPrice,
      guestName,
      guestEmail,
      guestPhone,
      selectedAddOns: selectedAddOns || []
    });

    const createdBooking = await booking.save();
    return NextResponse.json(createdBooking, { status: 201 });
  } catch (error: any) {
    console.error('Create Booking Error:', error);
    return NextResponse.json({ message: error.message || 'Server error while creating booking' }, { status: 500 });
  }
}
