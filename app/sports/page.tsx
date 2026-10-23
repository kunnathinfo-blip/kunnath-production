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
    setSelectedSport(sport);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Activities Grid */}
      <section className="py-12 sm:py-16 pb-32">
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

            {/* Coming Soon Activities */}
            {[
              {
                name: 'Foosball',
                image: '/sports/foosball.jpg',
                description: 'Challenge your friends to fast-paced, competitive table soccer matches in our game lounge.',
                icon: '⚽'
              },
              {
                name: 'RC Car Track',
                image: '/sports/rc_car.jpg',
                description: 'High-speed remote-controlled off-road racing circuit complete with berms, bumps, and jumps.',
                icon: '🏎️'
              },
              {
                name: 'Dirt Bike',
                image: '/sports/dirt_bike.jpg',
                description: 'Thrilling off-road trail riding designed for dirt bike enthusiasts seeking countryside adrenaline.',
                icon: '🏍️'
              }
            ].map((activity) => (
              <div
                key={activity.name}
                className="group bg-white rounded-[40px] border border-gray-100 shadow-soft hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col relative"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                    {activity.icon}
                  </div>

                  {/* Coming Soon Badge */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                    Coming Soon
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {activity.name}
                    </h3>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} />
                        <span className="text-xs font-semibold">Opening Shortly</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span>New Experience</span>
                      </div>
                    </div>

                    <button
                      disabled
                      className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-400 bg-gray-100 cursor-not-allowed text-sm"
                    >
                      Coming Soon
                    </button>
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
