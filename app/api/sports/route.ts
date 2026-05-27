import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Sport from '@/lib/db/models/Sport';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sports = await Sport.find({});
    return NextResponse.json(sports);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
