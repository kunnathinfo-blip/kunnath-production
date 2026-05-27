import mongoose from 'mongoose';

const farmStaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  weekendPrice: {
    type: Number,
    required: true
  },
  beds: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  halls: {
    type: Number,
    default: 0
  },
  maxGuests: {
    type: Number,
    default: 2
  },
  extraGuestCharge: {
    type: Number,
    default: 0
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  bookingAdvance: {
    type: Number,
    default: 0
  },
  foodOptions: [{
    type: String
  }],
  addOns: [{
    name: String,
    price: Number
  }],
  images: [{
    type: String
  }],
  gallery: {
    exterior: [{ type: String }],
    living: [{ type: String }],
    bedroom: [{ type: String }],
    bathroom: [{ type: String }],
    kitchen: [{ type: String }],
    amenities: [{ type: String }]
  },
  amenities: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const FarmStay = mongoose.models.FarmStay || mongoose.model('FarmStay', farmStaySchema);
export default FarmStay;
export type IFarmStay = mongoose.InferSchemaType<typeof farmStaySchema> & { _id: mongoose.Types.ObjectId };
