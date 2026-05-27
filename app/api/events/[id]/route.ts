import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/db/models/Event';
import { checkAdmin } from '@/lib/auth/protect';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const event = await Event.findById(id);

    if (event) {
      Object.assign(event, body);
      const updatedEvent = await event.save();
      return NextResponse.json(updatedEvent);
    } else {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Update Event Error:', error);
    return NextResponse.json({ message: 'Server Error updating event', error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id } = await params;
    const event = await Event.findById(id);

    if (event) {
      await event.deleteOne();
      return NextResponse.json({ message: 'Event removed' });
    } else {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Delete Event Error:', error);
    return NextResponse.json({ message: 'Server Error deleting event', error: error.message }, { status: 500 });
  }
}
