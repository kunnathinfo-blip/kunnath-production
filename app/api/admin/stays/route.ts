import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';
import { checkAdmin } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const stay = new FarmStay(body);
    const createdStay = await stay.save();
    return NextResponse.json(createdStay, { status: 201 });
  } catch (error: any) {
    console.error('Admin Create Stay Error:', error);
    return NextResponse.json({ message: 'Error creating stay', error: error.message }, { status: 500 });
  }
}
