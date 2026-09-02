'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { BedDouble, Users, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useStays, FarmStay } from '@/hooks/useStays';
import StayCardSlider from '@/Components/stays/StayCardSlider';
import { SkeletonStayCard } from '@/Components/ui/SkeletonStayCard';
import { EventBookingModal } from '@/Components/events/EventBookingModal';

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

export default function EventsPage() {
  const { data: stays, isLoading } = useStays();
  const [selectedStayForBooking, setSelectedStayForBooking] = useState<FarmStay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayStays = useMemo(() => {
    const list = (stays && stays.length > 0) ? stays : (FALLBACK_STAYS as FarmStay[]);
    const order: Record<string, number> = { 'Orange': 1, 'Lemon': 2, 'Mint': 3 };
    return [...list].sort((a, b) => (order[a.name] || 99) - (order[b.name] || 99)).slice(0, 3);
  }, [stays]);

  const handleOpenBookingModal = (stay: FarmStay) => {
    setSelectedStayForBooking(stay);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <Container className="relative z-10 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-1.5">
            <Sparkles size={16} /> Unforgettable Celebrations
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Host Your Event
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Choose from our premium farm stays for your corporate retreats, family celebrations, and private events at Kunnath House.
          </p>
        </Container>
      </section>

      {/* Events / Stay Cards Section */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            <>
              <SkeletonStayCard />
              <SkeletonStayCard />
              <SkeletonStayCard />
            </>
          ) : (
            displayStays.map((stay) => {
              const eventTitle = `Event at ${stay.name} Stay`;
              return (
                <div key={stay._id} className="block group">
                  <Card className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 rounded-[32px]">
                    <div className="aspect-[16/10] relative overflow-hidden rounded-[24px] m-2.5">
                      <StayCardSlider
                        images={stay.images}
                        stayName={eventTitle}
                        stayId={stay._id}
                        description={stay.description}
                        bedrooms={stay.bedrooms}
                        capacity={stay.capacity}
                      />
                    </div>

                    <div className="p-6 pt-2 flex flex-col flex-1">
                      <h3 className="text-xl font-black tracking-tighter text-primary leading-none mb-3 group-hover:text-primary/80 transition-colors duration-500">
                        {eventTitle}
                      </h3>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                          <BedDouble size={13} className="text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-500">{stay.bedrooms} BHK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-500">Up to {stay.capacity} Guests</span>
                        </div>
                      </div>

                      <div className="mt-auto space-y-3 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weekdays</span>
                          <span className="text-base font-black text-gray-900">{formatCurrency(stay.price)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weekends</span>
                          <span className="text-base font-black text-gray-900">{formatCurrency(stay.weekendPrice || 0)}</span>
                        </div>

                        {/* Bottom Book Event Button */}
                        <Button
                          fullWidth
                          size="md"
                          className="py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg mt-2"
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
