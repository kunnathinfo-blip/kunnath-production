'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Users, Sparkles, Calendar, MapPin, ArrowRight, Trophy, Flag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useStays, FarmStay } from '@/hooks/useStays';
import StayCardSlider from '@/Components/stays/StayCardSlider';
import { SkeletonStayCard } from '@/Components/ui/SkeletonStayCard';
import { EventBookingModal } from '@/Components/events/EventBookingModal';
import EventCelebrationMarquee from '@/Components/events/EventCelebrationMarquee';
import { EVENT_PRICING_DETAILS, INITIAL_UPCOMING_EVENTS, UpcomingEventItem } from '@/lib/constants/events';
import { useInfiniteEvents } from '@/hooks/useEvents';
import Link from 'next/link';

const FALLBACK_STAYS: Partial<FarmStay>[] = [
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

export default function EventsPage() {
  const { data: stays, isLoading } = useStays();
  const [selectedStayForBooking, setSelectedStayForBooking] = useState<FarmStay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch upcoming events from API if any, with fallback to INITIAL_UPCOMING_EVENTS
  const { data: eventsData } = useInfiniteEvents('Upcoming');

  const upcomingEvents: UpcomingEventItem[] = useMemo(() => {
    const apiEvents = eventsData?.pages.flatMap(p => p.events) || [];
    if (apiEvents.length > 0) {
      // Map API events to UpcomingEventItem
      const mapped = apiEvents.map(e => ({
        _id: e._id,
        title: e.title,
        slug: e.slug,
        category: e.category,
        tag: e.tags?.[0] || 'Event',
        shortDescription: e.shortDescription,
        description: e.description,
        date: new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        location: 'Kunnath House Estate',
        image: e.images?.[0] || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1200',
        price: e.price,
      }));

      // Ensure RC Car Race sample is included if not in API list
      const hasRcCar = mapped.some(e => e.slug.includes('rc-car'));
      if (!hasRcCar) {
        return [...INITIAL_UPCOMING_EVENTS, ...mapped];
      }
      return mapped;
    }
    return INITIAL_UPCOMING_EVENTS;
  }, [eventsData]);

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

      {/* Private Event Venues Section */}
      <Container className="py-16">
        <div className="max-w-3xl mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
            Private Event Venues
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight">
            Select Your Preferred Venue
          </h2>
          <p className="text-gray-500 mt-2 text-base">
            Event farm stay bookings include Lemon and Mint stays with overnight accommodation for up to 15 members, private pool, and outdoor lawns. Click Book Event to choose your gathering size and reserve directly.
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
                securityDepositNote: '₹ 10,000 security deposit extra (refundable)',
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

                      <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        {stay.description}
                      </p>

                      {/* Card Footer: Security Deposit Note & Book Event Button */}
                      <div className="mt-auto space-y-3 pt-2 border-t border-gray-100">
                        <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100/80 text-center">
                          <span className="text-[11px] font-semibold text-red-700">
                            + {eventDetails.securityDepositNote}
                          </span>
                        </div>

                        <Button
                          fullWidth
                          size="md"
                          className="py-3.5 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                          onClick={() => handleOpenBookingModal(stay)}
                        >
                          Host a Booking
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

      {/* Upcoming Events Section (Requirement 3.4) */}
      <section className="py-20 bg-gray-50/60 border-t border-gray-100">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                <Trophy size={14} /> Competitions & Experiences
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight mt-2">
                Upcoming Events
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl">
                Exciting live tournaments, championships, and entertainment experiences hosted at Kunnath House.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((evt) => (
              <div
                key={evt._id}
                className="bg-white rounded-[32px] border border-gray-100 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group hover:-translate-y-1.5"
              >
                {/* Event Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70"></div>

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                    <Flag size={12} /> {evt.tag || evt.category}
                  </div>

                  {/* Price Tag if applicable */}
                  {evt.price > 0 && (
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-lg text-xs font-black text-gray-900">
                      Entry: {formatCurrency(evt.price)}
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {evt.shortDescription}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-600 mb-6 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <Link href={`/events/${evt.slug}`}>
                    <Button
                      fullWidth
                      variant="outline"
                      className="py-3 text-xs font-bold rounded-xl border-gray-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View Details & Register <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Direct Booking Modal with Razorpay */}
      <EventBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stay={selectedStayForBooking}
      />
    </div>
  );
}
