import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Sport from '@/lib/db/models/Sport';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const sport = await Sport.findById(id);
    if (sport) {
      return NextResponse.json(sport);
    } else {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
  }
}
