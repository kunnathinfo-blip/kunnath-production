import mongoose from 'mongoose';

const sportBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlots: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length >= 1 && v.length <= 3;
      },
      message: 'You can book between 1 and 3 consecutive hour slots'
    }
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  timeSlot: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  expiresAt: {
    type: Date
  },
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  couponCode: {
    type: String
  },
  originalAmount: {
    type: Number
  },
  discountAmount: {
    type: Number
  },
  finalAmount: {
    type: Number
  }
}, { timestamps: true });

const SportBooking = mongoose.models.SportBooking || mongoose.model('SportBooking', sportBookingSchema);
export default SportBooking;
export type ISportBooking = mongoose.InferSchemaType<typeof sportBookingSchema> & { _id: mongoose.Types.ObjectId };
