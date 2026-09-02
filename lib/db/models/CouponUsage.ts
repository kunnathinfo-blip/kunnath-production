import mongoose from 'mongoose';

const couponUsageSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['stay', 'sport'],
    default: 'stay',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const CouponUsage = mongoose.models.CouponUsage || mongoose.model('CouponUsage', couponUsageSchema);
export default CouponUsage;
export type ICouponUsage = mongoose.InferSchemaType<typeof couponUsageSchema> & { _id: mongoose.Types.ObjectId };
