import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import Booking from '@/lib/db/models/Booking';
import SportBooking from '@/lib/db/models/SportBooking';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature');
  if (!signature) {
    console.error('Webhook Error: Missing x-razorpay-signature header');
    return NextResponse.json({ message: 'Missing signature header' }, { status: 400 });
  }

  const rawBody = await req.text();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('Webhook Warning: RAZORPAY_WEBHOOK_SECRET is not set in environment variables. Skipping signature verification in development.');
  } else {
    // Cryptographic validation using raw body string
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(rawBody);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('Webhook Security Alert: Invalid webhook signature detected!');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
  }

  try {
    const { event, payload } = JSON.parse(rawBody);
    console.log(`Webhook Received: ${event}`);

    await connectDB();

    if (event === 'order.paid' || event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const capturedAmount = paymentEntity.amount; // in paise

      let booking = await Booking.findOne({ razorpayOrderId: orderId });
      let isSport = false;

      if (!booking) {
        booking = await SportBooking.findOne({ razorpayOrderId: orderId });
        isSport = true;
      }

      if (!booking) {
        console.warn(`Webhook Warning: Booking not found for Razorpay Order ID: ${orderId}`);
        return NextResponse.json({ status: 'ignored', message: 'Booking not found' });
      }

      // Idempotency: skip if already processed
      if (booking.paymentStatus === 'completed') {
        console.log(`Webhook Log: Booking ${booking._id} already confirmed.`);
        return NextResponse.json({ status: 'ok', message: 'Already processed' });
      }

      // Amount Tampering Check
      const expectedAmount = isSport 
        ? Math.round(booking.totalPrice * 100) 
        : Math.round((booking as any).upfrontAmountPaid * 100);

      if (Math.abs(capturedAmount - expectedAmount) > 1) {
        console.error(`Webhook Security Alert: Amount mismatch! Expected ${expectedAmount} paise, received ${capturedAmount} paise. Booking ID: ${booking._id}`);
        booking.paymentStatus = 'failed';
        await booking.save();
        return NextResponse.json({ message: 'Amount mismatch' }, { status: 400 });
      }

      // Confirm booking
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      booking.razorpayPaymentId = paymentId;
      booking.expiresAt = undefined;
      await booking.save();

      console.log(`Webhook Success: Booking ${booking._id} (${isSport ? 'Sport' : 'Stay'}) confirmed successfully.`);
      return NextResponse.json({ status: 'ok', message: 'Booking confirmed' });
    }

    if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      let booking = await Booking.findOne({ razorpayOrderId: orderId });
      if (!booking) {
        booking = await SportBooking.findOne({ razorpayOrderId: orderId });
      }

      if (!booking) {
        return NextResponse.json({ status: 'ignored', message: 'Booking not found' });
      }

      if (booking.paymentStatus === 'completed') {
        return NextResponse.json({ status: 'ok', message: 'Keep existing success' });
      }

      booking.paymentStatus = 'failed';
      await booking.save();

      console.log(`Webhook Fail: Booking ${booking._id} payment failed.`);
      return NextResponse.json({ status: 'ok', message: 'Payment marked as failed' });
    }

    if (event === 'refund.processed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      let booking = await Booking.findOne({ razorpayOrderId: orderId });
      if (!booking) {
        booking = await SportBooking.findOne({ razorpayOrderId: orderId });
      }

      if (booking) {
        booking.paymentStatus = 'refunded';
        booking.status = 'cancelled';
        await booking.save();
        console.log(`Webhook Refund: Booking ${booking._id} set to refunded/cancelled.`);
      }
      return NextResponse.json({ status: 'ok', message: 'Refund synchronized' });
    }

    // Default response for unhandled events
    return NextResponse.json({ status: 'ok', message: 'Event unhandled' });

  } catch (error: any) {
    console.error('Webhook Error inside handleWebhook:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
