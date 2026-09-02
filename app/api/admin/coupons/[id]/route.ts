export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Coupon from '@/lib/db/models/Coupon';
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
    const coupon = await Coupon.findById(id);

    if (coupon) {
      coupon.type = body.type || coupon.type;
      coupon.value = body.value !== undefined ? body.value : coupon.value;
      coupon.minimumAmount = body.minimumAmount !== undefined ? body.minimumAmount : coupon.minimumAmount;
      coupon.maximumDiscount = body.maximumDiscount !== undefined ? body.maximumDiscount : coupon.maximumDiscount;
      coupon.usageLimit = body.usageLimit !== undefined ? body.usageLimit : coupon.usageLimit;
      coupon.perUserLimit = body.perUserLimit !== undefined ? body.perUserLimit : coupon.perUserLimit;
      coupon.startDate = body.startDate || coupon.startDate;
      coupon.expiryDate = body.expiryDate || coupon.expiryDate;
      coupon.isActive = body.isActive !== undefined ? body.isActive : coupon.isActive;
      coupon.applicableTo = body.applicableTo || coupon.applicableTo;

      if (body.code) {
        const code = body.code.trim().toUpperCase();
        if (code !== coupon.code) {
          const existingCoupon = await Coupon.findOne({ code });
          if (existingCoupon) {
            return NextResponse.json({ message: 'A coupon with this code already exists.' }, { status: 400 });
          }
          coupon.code = code;
        }
      }

      const updatedCoupon = await coupon.save();
      return NextResponse.json(updatedCoupon);
    } else {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Update Coupon Error:', error);
    return NextResponse.json({ message: 'Error updating coupon', error: error.message }, { status: 500 });
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
    const coupon = await Coupon.findById(id);

    if (coupon) {
      await Coupon.findByIdAndDelete(id);
      return NextResponse.json({ message: 'Coupon deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Delete Coupon Error:', error);
    return NextResponse.json({ message: 'Error deleting coupon', error: error.message }, { status: 500 });
  }
}
