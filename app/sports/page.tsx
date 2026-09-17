'use client';

import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { useSports, Sport } from '@/hooks/useSports';
import { useCheckStayBooking } from '@/hooks/useSportBookings';
import BookingModal from '@/Components/sports/BookingModal';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Clock, Zap, Trophy, ArrowRight, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SportsPage() {
  const { data: sports, isLoading, isError } = useSports();
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: stayCheck } = useCheckStayBooking();

  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (sport: Sport) => {
    if (!user) {
      router.push('/login?redirect=/sports');
      return;
    }
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Compact so cards are immediately visible */}
      <section className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dekz7rtoa/image/upload/v1779688300/box_cricket_rhkt0l.webp')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/80"></div>

        <Container className="relative z-10 text-center">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-2.5 inline-flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
            <Trophy size={14} /> Premium Sports Facilities
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 tracking-tight max-w-3xl mx-auto leading-tight">
            Elevate Your Stay <span className="font-normal italic text-gray-200">with Action</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            From professional turf cricket to high-octane ATV rides, explore our world-class facilities.
          </p>
        </Container>
      </section>

      {/* Activities Grid */}
      <section className="py-8 sm:py-10 pb-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] bg-gray-50 rounded-3xl animate-pulse border border-gray-100"></div>
              ))
            ) : sports?.filter(sport => !sport.name?.toLowerCase().includes('bowling machine')).map((sport) => (
              <div
                key={sport._id}
                className="group bg-white rounded-[40px] border border-gray-100 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                    {sport.icon}
                  </div>

                  {/* Pricing Badge */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">{formatCurrency(sport.price)}</span>
                    <span className="text-gray-400 text-xs border-l pl-2 border-gray-200">/ hr</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {sport.name}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                    {sport.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} />
                        <span className="text-xs font-semibold">1–3 Hour Slots</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Zap size={16} />
                        <span className="text-xs font-semibold">Instant Booking</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookNow(sport)}
                      className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                    >
                      Book Your Session <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <BookingModal
        sport={selectedSport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hasStayBooking={stayCheck?.hasStayBooking ?? false}
      />
    </div>
  );
}
