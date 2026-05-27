import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';
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
    const stay = await FarmStay.findById(id);

    if (stay) {
      stay.name = body.name || stay.name;
      stay.slug = body.slug || stay.slug;
      stay.price = body.price !== undefined ? body.price : stay.price;
      stay.capacity = body.capacity !== undefined ? body.capacity : stay.capacity;
      stay.beds = body.beds !== undefined ? body.beds : stay.beds;
      stay.bathrooms = body.bathrooms !== undefined ? body.bathrooms : stay.bathrooms;
      stay.bedrooms = body.bedrooms !== undefined ? body.bedrooms : stay.bedrooms;
      stay.halls = body.halls !== undefined ? body.halls : stay.halls;
      stay.maxGuests = body.maxGuests !== undefined ? body.maxGuests : stay.maxGuests;
      stay.extraGuestCharge = body.extraGuestCharge !== undefined ? body.extraGuestCharge : stay.extraGuestCharge;
      stay.securityDeposit = body.securityDeposit !== undefined ? body.securityDeposit : stay.securityDeposit;
      stay.bookingAdvance = body.bookingAdvance !== undefined ? body.bookingAdvance : stay.bookingAdvance;
      stay.description = body.description || stay.description;
      stay.amenities = body.amenities || stay.amenities;
      stay.images = body.images || stay.images;
      stay.foodOptions = body.foodOptions || stay.foodOptions;
      stay.addOns = body.addOns || stay.addOns;

      const updatedStay = await stay.save();
      return NextResponse.json(updatedStay);
    } else {
      return NextResponse.json({ message: 'Stay not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Update Stay Error:', error);
    return NextResponse.json({ message: 'Error updating stay', error: error.message }, { status: 500 });
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
    const stay = await FarmStay.findById(id);

    if (stay) {
      stay.isDeleted = true;
      await stay.save();
      return NextResponse.json({ message: 'Stay removed' });
    } else {
      return NextResponse.json({ message: 'Stay not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Delete Stay Error:', error);
    return NextResponse.json({ message: 'Error deleting stay', error: error.message }, { status: 500 });
  }
}
