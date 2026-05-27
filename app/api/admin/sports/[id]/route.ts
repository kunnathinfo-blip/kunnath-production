import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Sport from '@/lib/db/models/Sport';
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
    const sport = await Sport.findById(id);

    if (sport) {
      sport.name = body.name || sport.name;
      sport.price = body.price || sport.price;
      sport.duration = body.duration || sport.duration;
      sport.image = body.image || sport.image;
      sport.description = body.description || sport.description;
      sport.icon = body.icon || sport.icon;

      const updatedSport = await sport.save();
      return NextResponse.json(updatedSport);
    } else {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Update Sport Error:', error);
    return NextResponse.json({ message: 'Error updating sport', error: error.message }, { status: 500 });
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
    const sport = await Sport.findByIdAndDelete(id);

    if (sport) {
      return NextResponse.json({ message: 'Sport removed' });
    } else {
      return NextResponse.json({ message: 'Sport not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Delete Sport Error:', error);
    return NextResponse.json({ message: 'Error deleting sport', error: error.message }, { status: 500 });
  }
}
