import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../lib/db/connect';
import FarmStay from '../lib/db/models/FarmStay';
import Sport from '../lib/db/models/Sport';
import Event from '../lib/db/models/Event';

// Manual env loading for standalone script execution
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

const dummyStays = [
  {
    name: 'Orange',
    slug: 'orange',
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
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685469/Mainview_yviktw.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685471/Pool_uigk8q.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685471/Others4_gslwsx.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685470/Others3_ihbdbs.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685470/Others2_di6zyi.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685469/Others1_ryfahu.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685469/Others_6_vceo0e.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685469/Others_pcy3rq.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685468/Others_5_juv6zy.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685467/Living_Room_ncnzev.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685461/2-Bedroom_pnhyqb.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685460/1-_Bedrrom_cnk71d.jpg'
    ],
    gallery: {
      exterior: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685466/Others4_ovcvhl.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685465/Others3_klkhbz.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685465/Others1_g6navm.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685464/Mainview_vyb716.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685464/Others_6_ff5ntz.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685463/Others_5_sznm7x.jpg'
      ],
      living: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685464/Others_ruhjcr.jpg'
      ],
      bedroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685462/2-Bedroom_ldgqfu.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685462/1-_Bedrrom_douj2m.jpg'
      ],
      bathroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685465/Others2_mkb05p.jpg'
      ],
      kitchen: [],
      amenities: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685471/Pool_uigk8q.jpg'
      ]
    },
    amenities: ['Private Swimming Pool', 'Lawn', 'Bonfires', 'Outdoor Projector', '55inch Smart TV', 'Party speaker', 'RO Water', 'Refrigerator', 'Barbeque', 'Microwave', 'Kitchen', 'WIFI', 'Extra Mattresses', 'Geyser', 'AC', 'Campfire', 'Restaurant'],
    foodOptions: ['Swiggy & Zomato Available', 'Chef Available on request', 'In-House kitchen available'],
    addOns: [{ name: 'Campfire', price: 750 }],
    description: 'Orange is a 2BHK peaceful retreat with private swimming pool, designed for comfort, fun, and memorable moments. Ideal for families, friends, and weekend escapes, this beautifully maintained space offers the perfect balance of relaxation and entertainment.',
  },
  {
    name: 'Lemon',
    slug: 'lemon',
    price: 20000,
    weekendPrice: 25000,
    beds: 5,
    bedrooms: 5,
    bathrooms: 4,
    halls: 4,
    capacity: 20,
    maxGuests: 25,
    extraGuestCharge: 500,
    securityDeposit: 5000,
    bookingAdvance: 5000,
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685484/Mainview_dv9s6f.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685492/Bedrrom3_kqd2cl.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685487/Others2_zzl8xr.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685486/Others3_uxesn7.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685485/others1_ygso5i.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685485/Kitchen_tvya1f.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685485/Living_room1_dmqjfi.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685484/Others_twm8kk.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685483/Living_room_g7vump.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685478/Bedrrom2_rj8ixp.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685478/Bedroom4_tq0whr.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685477/Bedrrom_1_rlqd4j.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685472/1-Living_room_2_ms2z0w.jpg'
    ],
    gallery: {
      exterior: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685481/Others2_dfpzhj.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685479/Others3_y2biz0.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685478/others1_urwa9t.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685478/Mainview_tzbbwy.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685477/Others_blgmxl.jpg'
      ],
      living: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685483/Living_room_s5mxpk.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685482/Living_room1_xcnw6f.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685481/1-Living_room_2_anmwmr.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685486/Kitchen_ao0ve6.jpg'
      ],
      bedroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685488/Bedrrom3_uin0wv.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685474/Bedroom4_ibqnxe.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685473/Bedrrom2_aazt6q.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685473/Bedrrom_1_bwobz1.jpg'
      ],
      bathroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685487/Others2_zzl8xr.jpg'
      ],
      kitchen: [],
      amenities: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685484/Mainview_dv9s6f.jpg'
      ]
    },
    amenities: ['Swimming Pool', 'Music System', 'WIFI', 'Refrigerator', 'Microwave', 'BBQ Setup', '55inch Smart TV', 'Party speaker', 'RO Water', 'Extra Mattresses', 'Geyser', 'AC', 'Campfire', 'Restaurant'],
    foodOptions: ['Swiggy & Zomato Available', 'Chef Available on request', 'In-House kitchen available'],
    addOns: [{ name: 'Campfire', price: 750 }],
    description: 'Lemon is Spacious private stay with 2 villas, 5 bedrooms, and 4 large halls, ideal for groups up to 25 guests. Enjoy a swimming pool, music system, WiFi, refrigerator, microwave, and BBQ setup—perfect for family get-togethers, parties, and group stays.',
  },
  {
    name: 'Mint',
    slug: 'mint',
    price: 20000,
    weekendPrice: 25000,
    beds: 4,
    bedrooms: 4,
    bathrooms: 4,
    halls: 1,
    capacity: 15,
    maxGuests: 20,
    extraGuestCharge: 500,
    securityDeposit: 5000,
    bookingAdvance: 5000,
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/1-Living_room_pnip5v.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/others3_zrphvp.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/Others2_d5ny6s.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others1_zrlcfk.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685453/main_View_k548gg.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Bedroom_2_yevzeo.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Mint_bedroom_3_v33xjn.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others_fjrtel.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Pool_wbefpi.jpg'
    ],
    gallery: {
      exterior: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/others3_zrphvp.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/Others2_d5ny6s.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others1_zrlcfk.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685453/main_View_k548gg.jpg'
      ],
      living: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/1-Living_room_pnip5v.jpg'
      ],
      bedroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Bedroom_2_yevzeo.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Mint_bedroom_3_v33xjn.jpg'
      ],
      bathroom: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others_fjrtel.jpg'
      ],
      kitchen: [],
      amenities: [
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Pool_wbefpi.jpg',
        'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others_fjrtel.jpg'
      ]
    },
    amenities: ['Huge Swimming Pool', 'Party Lawn', 'Projector', '65” Smart TV', 'Powerful Music System', 'WIFI', 'Refrigerator', 'Microwave', 'BBQ Setup', '55inch Smart TV', 'Party speaker', 'RO Water', 'Kitchen', 'Extra Mattresses', 'Geyser', 'AC', 'Campfire', 'Restaurant'],
    foodOptions: ['Swiggy & Zomato Available', 'Chef Available on request', 'In-House kitchen available'],
    addOns: [{ name: 'Campfire', price: 750 }],
    description: 'Mint is a spacious 4-bedroom private stay featuring a living room, dining area, and a large party hall. Enjoy a huge swimming pool, party lawn, projector, 65” Smart TV, powerful music system, high-speed WIFI, refrigerator, microwave, and BBQ setup—perfect for celebrations, group stays, and unforgettable get-togethers.',
  },
];

const dummySports = [
  {
    name: 'Box Cricket',
    price: 999,
    duration: '1 hr',
    image: 'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779688300/box_cricket_rhkt0l.webp',
    description: 'Fully enclosed, turf-surfaced arena perfect for day or night matches with friends and family.',
    icon: '🏏'
  },
  {
    name: 'Volleyball',
    price: 399,
    duration: '1 hr',
    image: 'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779688297/volleyball_kvhufm.avif',
    description: 'Professional grade court for an exciting volleyball experience.',
    icon: '🏐'
  },
  {
    name: 'Cricket Bowling Machine',
    price: 299,
    duration: '30 mins',
    image: 'https://res.cloudinary.com/dwrxo4hvx/image/upload/v1777899658/2_cwqayd.webp',
    description: 'Practice your batting skills with our automated cricket bowling machine.',
    icon: '🏏'
  },
  {
    name: 'ATV Bike',
    price: 299,
    duration: '1 lap',
    image: 'https://res.cloudinary.com/dwrxo4hvx/image/upload/v1777899656/1_pknngl.jpg',
    description: 'Enjoy an adrenaline-filled ride on our off-road ATV track.',
    icon: '🏎️'
  },
  // {
  //   name: 'RC Car',
  //   price: 299,
  //   duration: '15 mins',
  //   image: 'https://res.cloudinary.com/dwrxo4hvx/image/upload/v1777899657/3_xdxidp.jpg',
  //   description: 'Have fun racing high-speed remote-controlled cars on our custom track.',
  //   icon: '🚗'
  // }
];

const dummyEvents = [
  {
    title: 'Holi Festival of Colors 2024',
    slug: 'holi-festival-2024',
    category: 'Upcoming',
    shortDescription: 'Join us for a vibrant celebration of Holi with organic colors, music, and traditional food.',
    description: 'Experience the magic of Holi at Kunnath House. We provide safe, organic colors, a live DJ playing the latest Bollywood hits, and an unlimited buffet of traditional snacks and drinks like Thandai. Perfect for families and groups looking for a premium, hassle-free celebration.',
    price: 1499,
    date: new Date('2024-03-25'),
    isFlexibleDate: false,
    images: ['https://images.unsplash.com/photo-1590076215667-873d37389b58?q=80&w=1200&auto=format&fit=crop'],
    capacity: 200,
    isActive: true,
    tags: ['Festival', 'Color', 'Music', 'Party']
  },
  {
    title: 'Executive Leadership Retreat',
    slug: 'executive-retreat',
    category: 'Corporate',
    shortDescription: 'Premium offsite location for high-level corporate meetings and team building.',
    description: 'Elevate your team performance in the serene environment of Kunnath House. Our corporate package includes exclusive use of the estate, high-speed WiFi, conference facilities, premium catering, and organized team-building activities like Box Cricket and ATV rides.',
    price: 25000,
    date: new Date('2024-06-15'),
    isFlexibleDate: true,
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop'],
    capacity: 50,
    isActive: true,
    tags: ['Corporate', 'Strategy', 'Offsite', 'Premium']
  },
  {
    title: 'Traditional Lawn Wedding',
    slug: 'traditional-wedding',
    category: 'Traditional',
    shortDescription: 'Exchange vows in a stunning outdoor setting surrounded by nature.',
    description: 'Transform your special day into an unforgettable masterpiece. Kunnath House offers expansive green lawns, traditional decor setups, and a private villa for the family. Our venue is perfect for intimate to mid-sized weddings seeking a rustic yet luxurious charm.',
    price: 75000,
    date: new Date('2024-11-20'),
    isFlexibleDate: true,
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'],
    capacity: 500,
    isActive: true,
    tags: ['Wedding', 'Traditional', 'Marriage', 'Outdoor']
  },
  {
    title: 'Monsoon Music Unplugged',
    slug: 'monsoon-music-2024',
    category: 'Upcoming',
    shortDescription: 'Enjoy live acoustic performances during the beautiful monsoon season.',
    description: 'Spend a rainy evening with us listening to soulful acoustic music. Set under our covered deck with the smell of wet earth and hot snacks, this event is designed for music lovers seeking a peaceful and intimate concert experience.',
    price: 999,
    date: new Date('2024-07-10'),
    isFlexibleDate: false,
    images: ['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop'],
    capacity: 80,
    isActive: true,
    tags: ['Music', 'Monsoon', 'Unplugged', 'Acoustic']
  },
  {
    title: 'New Year Eve Grand Gala',
    slug: 'new-year-2025',
    category: 'Upcoming',
    shortDescription: 'The ultimate countdown party with fireworks, gourmet dinner, and luxury stay options.',
    description: 'Ring in the new year at the most exclusive estate party in town. Our grand gala features a premium bar, a multi-cuisine gourmet dinner, a spectacular fireworks display at midnight, and an optional overnight stay in our luxury farmhouses.',
    price: 4999,
    date: new Date('2024-12-31'),
    isFlexibleDate: false,
    images: ['https://images.unsplash.com/photo-1530103862676-de3c9de59f9e?q=80&w=1200&auto=format&fit=crop'],
    capacity: 150,
    isActive: true,
    tags: ['New Year', 'Party', 'Fireworks', 'Dinner']
  }
];

const importData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing old collections...');
    await FarmStay.deleteMany({});
    await Sport.deleteMany({});
    await Event.deleteMany({});

    console.log('Seeding stays...');
    await FarmStay.insertMany(dummyStays);

    console.log('Seeding sports...');
    await Sport.insertMany(dummySports);

    console.log('Seeding events...');
    await Event.insertMany(dummyEvents);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

importData();
