import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/db/models/Event';
import EventBooking from '@/lib/db/models/EventBooking';
import { getAuthenticatedUser } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { eventId, date, guests, guestName, guestEmail, guestPhone, specialRequests } = await req.json();

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.capacity && guests > event.capacity) {
      return NextResponse.json({ message: `Maximum capacity for this event is ${event.capacity}` }, { status: 400 });
    }

    const totalPrice = event.price * guests;

    const booking = new EventBooking({
      userId: user._id,
      eventId,
      date,
      guests,
      totalPrice,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    });

    const createdBooking = await booking.save();
    return NextResponse.json(createdBooking, { status: 201 });
  } catch (error: any) {
    console.error('Create Event Booking Error:', error);
    return NextResponse.json({ message: 'Server Error creating booking', error: error.message }, { status: 500 });
  }
}
