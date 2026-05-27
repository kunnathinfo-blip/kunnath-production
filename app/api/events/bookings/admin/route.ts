import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventBooking from '@/lib/db/models/EventBooking';
// Register Event & User models for populating
import '@/lib/db/models/Event';
import '@/lib/db/models/User';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1') || 1;
    const limit = parseInt(url.searchParams.get('limit') || '10') || 10;
    const status = url.searchParams.get('status');
    const eventId = url.searchParams.get('eventId');
    const search = url.searchParams.get('search');

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (eventId && eventId !== 'all') query.eventId = eventId;
    if (search) {
      query.$or = [
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestPhone: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await EventBooking.find(query)
      .populate('eventId', 'title price category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Mark these as read
    if (bookings.length > 0) {
      const bookingIds = bookings.map(b => b._id);
      await EventBooking.updateMany({ _id: { $in: bookingIds } }, { isRead: true });
    }

    const total = await EventBooking.countDocuments(query);

    return NextResponse.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error: any) {
    console.error('Admin Fetch Event Bookings Error:', error);
    return NextResponse.json({ message: 'Server Error fetching bookings', error: error.message }, { status: 500 });
  }
}
