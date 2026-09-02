import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minimumAmount: {
    type: Number,
    default: 0,
  },
  maximumDiscount: {
    type: Number,
  },
  usageLimit: {
    type: Number,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicableTo: {
    type: String,
    enum: ['stay', 'sport'],
    default: 'stay',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default Coupon;
export type ICoupon = mongoose.InferSchemaType<typeof couponSchema> & { _id: mongoose.Types.ObjectId };
