import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Event'
  },
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'FarmStay'
  },
  date: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: false,
    default: 1
  },
  gatheringSize: {
    type: String
  },
  eventType: {
    type: String
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
    required: false,
    default: ''
  },
  guestPhone: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String
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
  securityDeposit: {
    type: Number,
    default: 10000
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

eventBookingSchema.index({ stayId: 1, date: 1 });

const EventBooking = mongoose.models.EventBooking || mongoose.model('EventBooking', eventBookingSchema);
export default EventBooking;
export type IEventBooking = mongoose.InferSchemaType<typeof eventBookingSchema> & { _id: mongoose.Types.ObjectId };
