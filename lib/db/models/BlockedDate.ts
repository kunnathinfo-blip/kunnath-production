import mongoose from 'mongoose';

const blockedDateSchema = new mongoose.Schema({
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmStay',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    enum: ['Offline Booking', 'Maintenance', 'Owner Use', 'Special Event', 'Other'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isOverride: {
    type: Boolean,
    default: false
  },
  customerName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Index for query performance
blockedDateSchema.index({ stayId: 1, startDate: 1, endDate: 1 });

const BlockedDate = mongoose.models.BlockedDate || mongoose.model('BlockedDate', blockedDateSchema);
export default BlockedDate;
