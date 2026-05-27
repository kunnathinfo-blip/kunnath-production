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

  if (isLoading) {
    return (
      <div className="py-32 bg-white min-h-screen">
        <Container>
          <div className="animate-pulse space-y-12">
            <div className="h-40 bg-gray-100 rounded-3xl w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] bg-gray-50 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#f3f4f6_0%,transparent_50%)] z-0"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Trophy size={16} /> Premium Sports Facilities
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Stay with Action.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              From professional turf cricket to high-octane ATV rides, we offer world-class facilities designed for champions and families alike.
            </p>
          </div>
        </Container>
      </section>

      {/* Activities Grid */}
      <section className="pb-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sports?.map((sport) => (
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
