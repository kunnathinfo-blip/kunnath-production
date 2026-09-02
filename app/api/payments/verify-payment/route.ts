import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import { getAuthenticatedUser } from '@/lib/auth/protect';
import { recordCouponUsage } from '@/lib/db/utils/couponHelper';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json({ message: 'Missing required payment verification details' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Idempotency
    if (booking.paymentStatus === 'completed') {
      return NextResponse.json({ 
        success: true, 
        message: 'Payment already verified successfully',
        booking 
      });
    }

    // Verify signature using the secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Razorpay secret key is not set' }, { status: 500 });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.razorpaySignature = razorpay_signature;
      booking.expiresAt = undefined; // Clear expiration hold
      
      await booking.save();
      
      // Record coupon usage
      try {
        await recordCouponUsage(booking, 'stay');
      } catch (couponError) {
        console.error('Error recording coupon usage:', couponError);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully',
        booking 
      });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();
      
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid payment signature' 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error in verifyPayment:', error);
    return NextResponse.json({ message: error.message || 'Server error during payment verification' }, { status: 500 });
  }
}
