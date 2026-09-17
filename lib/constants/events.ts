export interface EventPricingTier {
  label: string;
  price: number;
}

export interface EventPricingDetail {
  occupancy: string;
  overnightStay: string;
  tiers: EventPricingTier[];
  securityDeposit: number;
  securityDepositNote: string;
}

export const EVENT_PRICING_DETAILS: Record<string, EventPricingDetail> = {
  lemon: {
    occupancy: 'upto 100 Guests',
    overnightStay: 'Overnight stay up to 15 members',
    tiers: [
      { label: 'Up to 50 members gathering', price: 35000 },
      { label: '100 members gathering', price: 45000 },
    ],
    securityDeposit: 10000,
    securityDepositNote: '₹ 10,000 security deposit extra (refundable)',
  },
  mint: {
    occupancy: 'upto 200 Guests',
    overnightStay: 'Overnight stay up to 15 members',
    tiers: [
      { label: 'Up to 50 members gathering', price: 40000 },
      { label: '100 members gathering', price: 50000 },
      { label: '150 members gathering', price: 60000 },
      { label: '200 members gathering', price: 70000 },
    ],
    securityDeposit: 10000,
    securityDepositNote: '₹ 10,000 security deposit extra (refundable)',
  },
};

// Host an Event / Celebration Type Dropdown Options
export const EVENT_CELEBRATION_TYPES = [
  'Haldi & Mehndi',
  'Bachelor & Bachelorette Parties',
  'Family Get-Together',
  'Birthday Party',
  'Kitty Party & High Tea',
  'Engagement & Pre-Wedding',
  'Corporate Offsite & Retreat',
  'Sundowner & Pool Party',
  'Other Celebration',
] as const;

export type EventCelebrationType = typeof EVENT_CELEBRATION_TYPES[number];

// Initial / Sample Upcoming Event
export interface UpcomingEventItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tag: string;
  shortDescription: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number;
  showPrice?: boolean;
}

export const INITIAL_UPCOMING_EVENTS: UpcomingEventItem[] = [
  {
    _id: 'rc-car-race-upcoming',
    title: 'RC Car Race',
    slug: 'rc-car-race',
    category: 'Competition',
    tag: 'Competition Event',
    shortDescription: 'High-speed remote-controlled car racing tournament across custom off-road tracks at Kunnath House.',
    description: 'Get ready for an adrenaline-pumping RC Car Racing Championship! Bring your skills and compete against racers across thrilling obstacle courses and high-speed dirt straights. Complete event schedule, rules, and registration categories will be announced shortly.',
    date: '2026-10-15',
    location: 'Off-Road Track, Kunnath House',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1200&auto=format&fit=crop',
    price: 0,
    showPrice: false,
  },
];
