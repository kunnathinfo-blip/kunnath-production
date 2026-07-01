import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import BlockedDate from '@/lib/db/models/BlockedDate';
import Booking from '@/lib/db/models/Booking';
import { checkAdmin } from '@/lib/auth/protect';
import { parseUTCDate } from '@/lib/utils';

// DELETE: Remove a blocked date range
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id: stayId, blockId } = await params;

    const block = await BlockedDate.findOneAndDelete({ _id: blockId, stayId });

    if (!block) {
      return NextResponse.json({ message: 'Blocked date entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Dates unblocked successfully' });
  } catch (error: any) {
    console.error('Delete Blocked Date Error:', error);
    return NextResponse.json({ message: 'Error unblocking dates', error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing blocked date range
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id: stayId, blockId } = await params;
    const { startDate, endDate, reason, notes, override, customerName, phoneNumber, aadhaarNumber } = await req.json();

    if (!startDate || !endDate || !reason) {
      return NextResponse.json({ message: 'Start date, end date, and reason are required' }, { status: 400 });
    }

    const start = parseUTCDate(startDate);
    const end = parseUTCDate(endDate);

    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 });
    }

    // 1. Check for overlapping manual blocks (excluding this current block)
    const existingBlock = await BlockedDate.findOne({
      _id: { $ne: blockId },
      stayId,
      startDate: { $lt: end },
      endDate: { $gt: start }
    });

    if (existingBlock) {
      return NextResponse.json({ message: 'These dates overlap with another existing block' }, { status: 400 });
    }

    // 2. Check for overlapping customer bookings
    const conflictingBooking = await Booking.findOne({
      stayId,
      $and: [
        { checkIn: { $lt: end } },
        { checkOut: { $gt: start } }
      ],
      $or: [
        { status: 'confirmed' },
        { status: 'pending', expiresAt: { $gt: new Date() } }
      ]
    });

    if (conflictingBooking && !override) {
      return NextResponse.json({
        message: 'These dates conflict with an existing customer booking. Please resolve the conflict or check Override.',
        conflict: true
      }, { status: 409 });
    }

    // 3. Update the block
    const block = await BlockedDate.findOneAndUpdate(
      { _id: blockId, stayId },
      {
        startDate: start,
        endDate: end,
        reason,
        notes: notes || '',
        customerName: customerName || '',
        phoneNumber: phoneNumber || '',
        aadhaarNumber: aadhaarNumber || '',
        isOverride: !!conflictingBooking
      },
      { new: true }
    );

    if (!block) {
      return NextResponse.json({ message: 'Blocked date entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, block });
  } catch (error: any) {
    console.error('Update Blocked Date Error:', error);
    return NextResponse.json({ message: 'Error updating blocked dates', error: error.message }, { status: 500 });
  }
}
