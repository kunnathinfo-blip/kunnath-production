import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Sport from '@/lib/db/models/Sport';
import { checkAdmin } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { name, price, duration, image, description, icon } = await req.json();

    const sport = new Sport({
      name,
      price,
      duration,
      image,
      description,
      icon
    });

    const createdSport = await sport.save();
    return NextResponse.json(createdSport, { status: 201 });
  } catch (error: any) {
    console.error('Admin Create Sport Error:', error);
    return NextResponse.json({ message: 'Error creating sport', error: error.message }, { status: 500 });
  }
}
