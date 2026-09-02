export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Coupon from '@/lib/db/models/Coupon';
import { checkAdmin } from '@/lib/auth/protect';

// GET: Retrieve all coupons (for admin list)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    console.error('Fetch Coupons Error:', error);
    return NextResponse.json({ message: 'Error fetching coupons', error: error.message }, { status: 500 });
  }
}

// POST: Create a new coupon
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    
    if (!body.code || !body.type || !body.value || !body.startDate || !body.expiryDate) {
      return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
    }

    const code = body.code.trim().toUpperCase();
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json({ message: 'A coupon with this code already exists.' }, { status: 400 });
    }

    const coupon = new Coupon({
      ...body,
      code,
      createdBy: isAdmin._id,
    });

    const createdCoupon = await coupon.save();
    return NextResponse.json(createdCoupon, { status: 201 });
  } catch (error: any) {
    console.error('Create Coupon Error:', error);
    return NextResponse.json({ message: 'Error creating coupon', error: error.message }, { status: 500 });
  }
}
