import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../lib/db/connect';
import FarmStay from '../lib/db/models/FarmStay';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key && !key.startsWith('#')) {
        process.env[key] = value;
      }
    }
  }
}

// ── Images Segregated from Cloudinary Uploads ──
// Convert any .heic to .jpg via Cloudinary format delivery
const cdn = (url: string) => url.replace(/\.heic$/i, '.jpg');

// Featured images for hero collage and card preview
const featuredImages = [
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425909/Pool_1_mgze5n.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425752/Living_1_wrupr1.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425763/Bedroom_1_intnj1.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425888/Lawn_g5xeuy.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425707/Paddy_1_pfvrhi.jpg'),
];

const categorizedImages = {
  rooms: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425763/Bedroom_1_intnj1.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425837/Bedroom_2_on16if.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425770/Bedroom_3_lavjpo.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425818/Bedroom_4_jybkwk.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425812/Bedroom_5_fetsib.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425821/Bedroom_6_icgvtv.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425752/Living_1_wrupr1.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425761/Living_2_sktn7m.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425740/Living_3_ddjnms.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425830/Living_4_dxxu4h.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425759/Living_5_cexya0.png'),
  ],
  amenities: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425909/Pool_1_mgze5n.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425906/Pool_2_kckgp7.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425923/Pool_3_awkfhc.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425899/Deck_1_kpxllg.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425888/Lawn_g5xeuy.png'),
  ],
  dining: [],
  activities: [],
  exterior: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425707/Paddy_1_pfvrhi.jpg'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425793/Paddy_field_a9cgx0.heic'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425882/Paddy_bnei9u.heic'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425855/Sunrise_bq01i3.heic'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425958/Verandah_zbpnix.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425899/Deck_1_kpxllg.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425888/Lawn_g5xeuy.png'),
  ],
  interior: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425752/Living_1_wrupr1.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425761/Living_2_sktn7m.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425740/Living_3_ddjnms.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425830/Living_4_dxxu4h.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425759/Living_5_cexya0.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425763/Bedroom_1_intnj1.png'),
  ]
};

const otherImages = [
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425966/WR_vwlaxo.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425967/WR1_fapx5p.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425970/WR2_uorwro.png'),
  cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425983/WR3_xjn7gu.png'),
];

const gallery = {
  exterior: categorizedImages.exterior,
  living: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425752/Living_1_wrupr1.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425761/Living_2_sktn7m.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425740/Living_3_ddjnms.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425830/Living_4_dxxu4h.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425759/Living_5_cexya0.png'),
  ],
  bedroom: [
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425763/Bedroom_1_intnj1.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425837/Bedroom_2_on16if.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425770/Bedroom_3_lavjpo.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425818/Bedroom_4_jybkwk.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425812/Bedroom_5_fetsib.png'),
    cdn('https://res.cloudinary.com/dekz7rtoa/image/upload/v1790425821/Bedroom_6_icgvtv.png'),
  ],
  bathroom: otherImages,
  kitchen: [],
  amenities: categorizedImages.amenities
};

const allFlatImages = [
  ...featuredImages,
  ...categorizedImages.rooms,
  ...categorizedImages.amenities,
  ...categorizedImages.exterior,
  ...otherImages
].filter((url, idx, arr) => arr.indexOf(url) === idx);

const lotusStay = {
  name: 'Lotus',
  slug: 'lotus',
  price: 10000,
  weekendPrice: 12000,
  beds: 2,
  bedrooms: 2,
  bathrooms: 2,
  halls: 1,
  capacity: 15,
  maxGuests: 20,
  extraGuestCharge: 500,
  securityDeposit: 5000,
  bookingAdvance: 5000,
  images: allFlatImages,
  featuredImages: featuredImages,
  categorizedImages: categorizedImages,
  otherImages: otherImages,
  gallery: gallery,
  amenities: [
    'Private Swimming Pool',
    "Separate Kids' Pool",
    'Lawn for Games',
    'WIFI',
    'Refrigerator',
    'Microwave',
    '55inch Smart TV',
    'RO Water',
    'Kitchen',
    'Extra Mattresses',
    'Geyser',
    'AC',
    'Campfire',
    'In-house Kitchen'
  ],
  foodOptions: ['Swiggy & Zomato Available', 'Chef Available on request', 'In-House kitchen available'],
  addOns: [{ name: 'Campfire', price: 750 }],
  description: "Surrounded by paddy fields, Lotus Farmhouse brings the charm of a traditional farmstay to a relaxed private getaway. It’s a place to slow down, spend time together, and enjoy the open countryside.\n\nThe farmhouse has two bedrooms and a living room, with space for family and friends to gather. Outside, enjoy the swimming pool, a separate kids’ pool, and a lawn for games or quiet evenings under the sky.\n\nCome for the peaceful setting. Stay for the moments you’ll share at Lotus.",
};

async function seedLotus() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Updating Lotus stay with segregated Cloudinary images...');
    const result = await FarmStay.updateOne({ slug: 'lotus' }, { $set: lotusStay });
    console.log('Update result:', result);

    const updated = await FarmStay.findOne({ slug: 'lotus' });
    console.log(`Lotus stay now has ${updated?.images?.length || 0} images in gallery!`);
    console.log('Featured images:', updated?.featuredImages);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Lotus stay:', error);
    process.exit(1);
  }
}

seedLotus();
