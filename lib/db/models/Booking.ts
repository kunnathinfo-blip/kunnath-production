import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'FarmStay'
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  guestName: {
    type: String,
    required: true
  },
  guestEmail: {
    type: String,
    required: true
  },
  guestPhone: {
    type: String,
    required: true
  },
  selectedAddOns: [{
    type: String
  }],
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
  isRead: {
    type: Boolean,
    default: false
  },
  upfrontAmountPaid: {
    type: Number,
    default: 0
  },
  amountDueAtCheckIn: {
    type: Number,
    default: 0
  },
  securityDeposit: {
    type: Number,
    default: 5000
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  securityDepositStatus: {
    type: String,
    enum: ['pending', 'refunded', 'retained'],
    default: 'pending'
  }
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
export type IBooking = mongoose.InferSchemaType<typeof bookingSchema> & { _id: mongoose.Types.ObjectId };
