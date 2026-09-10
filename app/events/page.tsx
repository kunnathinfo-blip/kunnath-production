'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Users, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useStays, FarmStay } from '@/hooks/useStays';
import StayCardSlider from '@/Components/stays/StayCardSlider';
import { SkeletonStayCard } from '@/Components/ui/SkeletonStayCard';
import { EventBookingModal } from '@/Components/events/EventBookingModal';
import EventCelebrationMarquee from '@/Components/events/EventCelebrationMarquee';

const FALLBACK_STAYS: Partial<FarmStay>[] = [
  {
    _id: 'orange-stay',
    name: 'Orange',
    slug: 'orange',
    bedrooms: 2,
    capacity: 15,
    price: 10000,
    weekendPrice: 12000,
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685469/Mainview_yviktw.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685471/Pool_uigk8q.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685471/Others4_gslwsx.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685470/Others3_ihbdbs.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685470/Others2_di6zyi.jpg',
    ],
    description: 'Orange is a 2BHK peaceful retreat with private swimming pool, designed for comfort, fun, and memorable events.',
  },
  {
    _id: 'lemon-stay',
    name: 'Lemon',
    slug: 'lemon',
    bedrooms: 5,
    capacity: 20,
    price: 20000,
    weekendPrice: 25000,
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685484/Mainview_dv9s6f.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685492/Bedrrom3_kqd2cl.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685487/Others2_zzl8xr.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685486/Others3_uxesn7.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685485/others1_ygso5i.jpg',
    ],
    description: 'Lemon is a spacious private stay with 2 villas, 5 bedrooms, and 4 large halls, ideal for group events up to 25 guests.',
  },
  {
    _id: 'mint-stay',
    name: 'Mint',
    slug: 'mint',
    bedrooms: 4,
    capacity: 15,
    price: 20000,
    weekendPrice: 25000,
    images: [
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/1-Living_room_pnip5v.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/others3_zrphvp.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685456/Others2_d5ny6s.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685454/Others1_zrlcfk.jpg',
      'https://res.cloudinary.com/dekz7rtoa/image/upload/v1779685452/Pool_wbefpi.jpg',
    ],
    description: 'Mint is a spacious 4-bedroom private stay featuring a huge swimming pool, party lawn, projector, and sound system for events.',
  },
];

// Specific event pricing and occupancy details for Kunnath House event farm stays
interface EventPricingTier {
  label: string;
  price: number;
}

interface EventPricingDetail {
  occupancy: string;
  overnightStay: string;
  tiers: EventPricingTier[];
  securityDeposit: string;
}

const EVENT_PRICING_DETAILS: Record<string, EventPricingDetail> = {
  lemon: {
    occupancy: 'upto 100 Guests',
    overnightStay: 'Overnight stay up to 15 members',
    tiers: [
      { label: 'Up to 50 members gathering', price: 35000 },
      { label: '100 members gathering', price: 45000 },
    ],
    securityDeposit: '₹ 10,000 security deposit extra (refundable)',
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
    securityDeposit: '₹ 10,000 security deposit extra (refundable)',
  },
};

export default function EventsPage() {
  const { data: stays, isLoading } = useStays();
  const [selectedStayForBooking, setSelectedStayForBooking] = useState<FarmStay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayStays = useMemo(() => {
    const list = (stays && stays.length > 0) ? stays : (FALLBACK_STAYS as FarmStay[]);
    // Farm stay event pricing includes Lemon and Mint only
    const eventStays = list.filter((s) => {
      const name = (s.name || '').toLowerCase();
      return name === 'lemon' || name === 'mint';
    });
    const order: Record<string, number> = { 'Lemon': 1, 'Mint': 2 };
    return [...eventStays].sort((a, b) => (order[a.name] || 99) - (order[b.name] || 99));
  }, [stays]);

  const handleOpenBookingModal = (stay: FarmStay) => {
    setSelectedStayForBooking(stay);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20 sm:py-24 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/80"></div>

        <Container className="relative z-10 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-4 inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
            <Sparkles size={16} /> Unforgettable Celebrations
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Host Your Event <span className="block sm:inline font-normal italic text-gray-200">at Kunnath House</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Choose from our premium farm stays for your corporate retreats, family celebrations, and private events at Kunnath House.
          </p>
        </Container>
      </section>

      {/* Celebration Marquee Section */}
      <EventCelebrationMarquee />

      {/* Events / Stay Cards Section */}
      <Container className="py-16">
        <div className="max-w-3xl mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
            Private Event Venues
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight">
            Select Your Preferred Venue
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Event farm stay bookings include Lemon and Mint stays with overnight accommodation for up to 15 members, private pool, and outdoor lawns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {isLoading ? (
            <>
              <SkeletonStayCard />
              <SkeletonStayCard />
            </>
          ) : (
            displayStays.map((stay) => {
              const eventTitle = `Event at ${stay.name} Stay`;
              const stayKey = (stay.name || '').toLowerCase().trim();
              const eventDetails = EVENT_PRICING_DETAILS[stayKey] || {
                occupancy: `upto ${stay.capacity} Guests`,
                overnightStay: 'Overnight stay up to 15 members',
                tiers: [{ label: 'Standard Gathering', price: stay.price }],
                securityDeposit: '₹ 10,000 security deposit extra (refundable)',
              };

              return (
                <div key={stay._id} className="block group">
                  <Card className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 rounded-[32px]">
                    <div className="aspect-[16/10] relative overflow-hidden rounded-[24px] m-2.5">
                      <StayCardSlider
                        images={stay.images}
                        stayName={eventTitle}
                        stayId={stay._id}
                        description={stay.description}
                        hideBhk={true}
                      />
                    </div>

                    <div className="p-6 pt-2 flex flex-col flex-1">
                      <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-primary leading-none mb-3 group-hover:text-primary/80 transition-colors duration-500">
                        {eventTitle}
                      </h3>

                      {/* Event Badges: Occupancy & Overnight Stay */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-700">
                          <Users size={13} className="text-primary shrink-0" />
                          <span className="text-xs font-semibold">
                            Occupancy: <span className="font-bold text-gray-900">{eventDetails.occupancy}</span>
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800">
                          <span className="text-xs font-semibold">
                            🌙 {eventDetails.overnightStay}
                          </span>
                        </div>
                      </div>

                      {/* Event Gathering Pricing Tiers (Replaces Weekday / Weekend) */}
                      <div className="mt-auto space-y-2.5 pt-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center justify-between">
                          <span>Gathering Size</span>
                          <span>Event Pricing</span>
                        </div>

                        {eventDetails.tiers.map((tier, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm"
                          >
                            <span className="text-xs font-bold text-gray-700">{tier.label}</span>
                            <span className="text-sm sm:text-base font-black text-gray-900">
                              {formatCurrency(tier.price)}
                            </span>
                          </div>
                        ))}

                        {/* Security Deposit Note */}
                        <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100/80 text-center">
                          <span className="text-[11px] font-semibold text-red-700">
                            + {eventDetails.securityDeposit}
                          </span>
                        </div>

                        {/* Bottom Book Event Button */}
                        <Button
                          fullWidth
                          size="md"
                          className="py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg mt-2 cursor-pointer"
                          onClick={() => handleOpenBookingModal(stay)}
                        >
                          Book Event
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </Container>

      {/* Booking Modal */}
      <EventBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stay={selectedStayForBooking}
      />
    </div>
  );
}
