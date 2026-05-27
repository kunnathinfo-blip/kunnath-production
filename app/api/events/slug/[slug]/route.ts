import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/db/models/Event';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const event = await Event.findOne({ slug, isActive: true }).lean();
    if (event) {
      return NextResponse.json(event);
    } else {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Server Error fetching event', error: error.message }, { status: 500 });
  }
}
