export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { validateCouponBackend } from '@/lib/db/utils/couponHelper';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Not authorized, please log in first.' }, { status: 401 });
    }

    const { code, bookingType, bookingAmount } = await req.json();

    if (!code || !bookingType || bookingAmount === undefined) {
      return NextResponse.json({ message: 'Missing required validation fields.' }, { status: 400 });
    }

    const { coupon, discountAmount, finalAmount } = await validateCouponBackend({
      code,
      bookingType,
      bookingAmount: Number(bookingAmount),
      userId: user._id,
    });

    return NextResponse.json({
      success: true,
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      finalAmount,
    });
  } catch (error: any) {
    console.error('Validate Coupon API Error:', error);
    return NextResponse.json({ message: error.message || 'Error validating coupon' }, { status: 400 });
  }
}
