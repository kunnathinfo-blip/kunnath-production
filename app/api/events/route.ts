export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/db/models/Event';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1') || 1;
    const limit = parseInt(url.searchParams.get('limit') || '9') || 9;
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const query: any = { isActive: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const events = await Event.find(query)
      .select('title slug category price date images shortDescription isFlexibleDate')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasMore: page * limit < total,
      total
    });
  } catch (error: any) {
    console.error('Fetch Events Error:', error);
    return NextResponse.json({ message: 'Server Error fetching events', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const event = new Event(body);
    const createdEvent = await event.save();
    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'An event with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server Error creating event', error: error.message }, { status: 500 });
  }
}
