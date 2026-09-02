import connectDB from '@/lib/db/connect';
import Coupon from '@/lib/db/models/Coupon';
import CouponUsage from '@/lib/db/models/CouponUsage';
import mongoose from 'mongoose';

interface ValidateCouponParams {
  code: string;
  bookingType: 'stay' | 'sport';
  bookingAmount: number;
  userId: string | mongoose.Types.ObjectId;
}

export async function validateCouponBackend({
  code,
  bookingType,
  bookingAmount,
  userId,
}: ValidateCouponParams) {
  await connectDB();

  const uppercaseCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: uppercaseCode });

  if (!coupon) {
    throw new Error('Coupon code does not exist.');
  }

  if (!coupon.isActive) {
    throw new Error('Coupon is currently inactive.');
  }

  const now = new Date();
  if (now < new Date(coupon.startDate)) {
    throw new Error('Coupon is not active yet.');
  }

  if (now > new Date(coupon.expiryDate)) {
    throw new Error('Coupon has expired.');
  }

  if (coupon.usageLimit !== undefined && coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit has been reached.');
  }

  if (coupon.applicableTo !== bookingType) {
    throw new Error(`This coupon is only applicable to ${coupon.applicableTo} bookings.`);
  }

  if (bookingAmount < coupon.minimumAmount) {
    throw new Error(`Minimum booking amount of ₹${coupon.minimumAmount} is required to use this coupon.`);
  }

  // Check per-user limit
  const userUsageCount = await CouponUsage.countDocuments({
    couponId: coupon._id,
    userId,
  });

  if (coupon.perUserLimit !== undefined && coupon.perUserLimit !== null && userUsageCount >= coupon.perUserLimit) {
    throw new Error('You have already reached the usage limit for this coupon.');
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (bookingAmount * coupon.value) / 100;
    if (coupon.maximumDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
    }
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  }

  // Ensure discount doesn't exceed booking amount
  discountAmount = Math.round(Math.min(discountAmount, bookingAmount));
  const finalAmount = Math.round(bookingAmount - discountAmount);

  return {
    coupon,
    discountAmount,
    finalAmount,
  };
}

export async function recordCouponUsage(
  booking: any,
  bookingType: 'stay' | 'sport'
) {
  await connectDB();

  if (!booking.couponId) return;

  // Idempotency check: see if usage is already logged for this booking
  const existingUsage = await CouponUsage.findOne({ bookingId: booking._id });
  if (existingUsage) {
    return;
  }

  const userId = booking.userId || booking.user;

  await CouponUsage.create({
    couponId: booking.couponId,
    bookingId: booking._id,
    bookingType,
    userId,
    discountAmount: booking.discountAmount || 0,
    usedAt: new Date(),
  });

  await Coupon.findByIdAndUpdate(booking.couponId, {
    $inc: { usedCount: 1 },
  });
}
