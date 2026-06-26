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
  featuredImages: [{
    type: String
  }],
  categorizedImages: {
    rooms: [{ type: String }],
    amenities: [{ type: String }],
    dining: [{ type: String }],
    activities: [{ type: String }],
    exterior: [{ type: String }],
    interior: [{ type: String }]
  },
  otherImages: [{
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

farmStaySchema.pre('save', function(this: any, next: any) {
  const stay = this as any;

  // If the new fields are not populated but old ones are, initialize them!
  if ((!stay.featuredImages || stay.featuredImages.length === 0) && stay.images && stay.images.length > 0) {
    stay.featuredImages = stay.images.slice(0, 5);
  }

  if (!stay.categorizedImages || (
    (!stay.categorizedImages.rooms || stay.categorizedImages.rooms.length === 0) &&
    (!stay.categorizedImages.amenities || stay.categorizedImages.amenities.length === 0) &&
    (!stay.categorizedImages.dining || stay.categorizedImages.dining.length === 0) &&
    (!stay.categorizedImages.activities || stay.categorizedImages.activities.length === 0) &&
    (!stay.categorizedImages.exterior || stay.categorizedImages.exterior.length === 0) &&
    (!stay.categorizedImages.interior || stay.categorizedImages.interior.length === 0)
  )) {
    // Populate categorizedImages from old gallery if it exists
    stay.categorizedImages = {
      rooms: [
        ...(stay.gallery?.bedroom || []),
        ...(stay.gallery?.living || []),
        ...(stay.gallery?.kitchen || []),
        ...(stay.gallery?.bathroom || [])
      ],
      amenities: stay.gallery?.amenities || [],
      dining: [],
      activities: [],
      exterior: stay.gallery?.exterior || [],
      interior: []
    };
  }

  if ((!stay.otherImages || stay.otherImages.length === 0) && stay.images && stay.images.length > 5) {
    stay.otherImages = stay.images.slice(5);
  }

  // Compile flat images list for backward compatibility with list pages/etc.
  const compiledImages: string[] = [];
  if (stay.featuredImages) {
    compiledImages.push(...stay.featuredImages.filter((img: string) => img && img.trim()));
  }
  if (stay.categorizedImages) {
    const cat = stay.categorizedImages;
    if (cat.rooms) compiledImages.push(...cat.rooms.filter((img: string) => img && img.trim()));
    if (cat.amenities) compiledImages.push(...cat.amenities.filter((img: string) => img && img.trim()));
    if (cat.dining) compiledImages.push(...cat.dining.filter((img: string) => img && img.trim()));
    if (cat.activities) compiledImages.push(...cat.activities.filter((img: string) => img && img.trim()));
    if (cat.exterior) compiledImages.push(...cat.exterior.filter((img: string) => img && img.trim()));
    if (cat.interior) compiledImages.push(...cat.interior.filter((img: string) => img && img.trim()));
  }
  if (stay.otherImages) {
    compiledImages.push(...stay.otherImages.filter((img: string) => img && img.trim()));
  }

  if (compiledImages.length > 0) {
    stay.images = compiledImages;
  }

  if (typeof next === 'function') {
    next();
  }
});

const FarmStay = mongoose.models.FarmStay || mongoose.model('FarmStay', farmStaySchema);
export default FarmStay;
export type IFarmStay = mongoose.InferSchemaType<typeof farmStaySchema> & { _id: mongoose.Types.ObjectId };
