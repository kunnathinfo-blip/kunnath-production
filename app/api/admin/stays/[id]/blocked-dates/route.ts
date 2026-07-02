export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import BlockedDate from '@/lib/db/models/BlockedDate';
import Booking from '@/lib/db/models/Booking';
import { checkAdmin } from '@/lib/auth/protect';
import { parseUTCDate } from '@/lib/utils';

// GET: Retrieve all date blocks for a stay
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id: stayId } = await params;
    const blocks = await BlockedDate.find({ stayId })
      .populate('blockedBy', 'name email')
      .sort({ startDate: 1 });

    return NextResponse.json(blocks);
  } catch (error: any) {
    console.error('Fetch Blocked Dates Error:', error);
    return NextResponse.json({ message: 'Error fetching blocked dates', error: error.message }, { status: 500 });
  }
}

// POST: Create a new date block
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id: stayId } = await params;
    const { startDate, endDate, reason, notes, override, customerName, phoneNumber, aadhaarNumber } = await req.json();

    if (!startDate || !endDate || !reason) {
      return NextResponse.json({ message: 'Start date, end date, and reason are required' }, { status: 400 });
    }

    const start = parseUTCDate(startDate);
    const end = parseUTCDate(endDate);

    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 });
    }

    // 1. Check for overlapping manual blocks
    const existingBlock = await BlockedDate.findOne({
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

    // 3. Create the new date block
    const block = await BlockedDate.create({
      stayId,
      startDate: start,
      endDate: end,
      reason,
      notes: notes || '',
      blockedBy: isAdmin._id,
      isOverride: !!conflictingBooking,
      customerName: customerName || '',
      phoneNumber: phoneNumber || '',
      aadhaarNumber: aadhaarNumber || ''
    });

    return NextResponse.json({ success: true, block }, { status: 201 });
  } catch (error: any) {
    console.error('Create Blocked Date Error:', error);
    return NextResponse.json({ message: 'Error blocking dates', error: error.message }, { status: 500 });
  }
}
