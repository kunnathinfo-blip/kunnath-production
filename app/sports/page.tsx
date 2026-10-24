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
    <div className="py-12 bg-white min-h-screen">
      <Container className="max-w-[1440px]">
        {/* 4 in a row grid matching stays page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl h-[420px] animate-pulse border border-gray-100" />
            ))
          ) : sports?.filter(sport => !sport.name?.toLowerCase().includes('bowling machine')).map((sport) => (
            <Card
              key={sport._id}
              className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 rounded-[28px]"
            >
              {/* Image Section - same aspect ratio as stays */}
              <div className="aspect-[16/10] relative overflow-hidden rounded-[22px] m-2.5 bg-gray-100">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                />
                {/* Floating Icon badge on image */}
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-gray-100/80 shadow-md flex items-center justify-center text-base">
                  {sport.icon}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 pt-1 flex flex-col flex-1">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-black tracking-tight text-primary leading-tight group-hover:text-primary/80 transition-colors duration-300">
                    {sport.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    <Zap size={11} className="text-emerald-600" /> Instant
                  </span>
                </div>

                {/* Badges: Slots & Experience */}
                <div className="flex items-center gap-3 mb-3 text-gray-500 font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-gray-400" />
                    <span>
                      {sport.bookingType === 'lap' || sport.name?.toLowerCase().includes('atv')
                        ? '15-Min Slots'
                        : '1–3 Hr Slots'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy size={13} className="text-gray-400" />
                    <span>
                      {sport.bookingType === 'lap' || sport.name?.toLowerCase().includes('atv')
                        ? 'Max 30/hr'
                        : 'All Ages'}
                    </span>
                  </div>
                </div>

                {/* Short description */}
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                  {sport.description}
                </p>

                {/* Combined Pricing Section: Blended background style matching stays cards */}
                <div className="mt-auto mb-3 bg-gray-50/70 border border-gray-100/90 rounded-2xl p-3 transition-colors duration-300 group-hover:bg-gray-50/90">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">
                        {sport.bookingType === 'lap' || sport.name?.toLowerCase().includes('atv')
                          ? 'Per Lap Rate'
                          : 'Hourly Rate'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {sport.bookingType === 'lap' || sport.name?.toLowerCase().includes('atv')
                          ? 'Off-Road Track'
                          : 'Per Session'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                        {formatCurrency(sport.price)}
                        <span className="text-[10px] font-normal text-gray-400 ml-0.5">
                          {sport.bookingType === 'lap' || sport.name?.toLowerCase().includes('atv')
                            ? '/lap'
                            : '/hr'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Session Button positioned at bottom like Check Availability */}
                <button
                  type="button"
                  onClick={() => handleBookNow(sport)}
                  className="w-full py-2.5 px-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] group/btn cursor-pointer"
                >
                  <span>Book Session</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </Card>
          ))}

          {/* Coming Soon Activities formatted consistently */}
          {[
            {
              name: 'Foosball',
              image: '/sports/foosball.jpg',
              description: 'Challenge your friends to fast-paced, competitive table soccer matches.',
              icon: '⚽'
            },
            {
              name: 'RC Car Track',
              image: '/sports/rc_car.jpg',
              description: 'High-speed remote-controlled off-road racing circuit with jumps and berms.',
              icon: '🏎️'
            },
            {
              name: 'Dirt Bike',
              image: '/sports/dirt_bike.jpg',
              description: 'Thrilling off-road trail riding designed for dirt bike enthusiasts.',
              icon: '🏍️'
            }
          ].map((activity) => (
            <Card
              key={activity.name}
              className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 rounded-[28px]"
            >
              {/* Image Section */}
              <div className="aspect-[16/10] relative overflow-hidden rounded-[22px] m-2.5 bg-gray-100">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                />
                <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-gray-100/80 shadow-md flex items-center justify-center text-base">
                  {activity.icon}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                  Coming Soon
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 pt-1 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-black tracking-tight text-gray-900 leading-tight">
                    {activity.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-3 text-gray-500 font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-gray-400" />
                    <span>Opening Shortly</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>New</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                  {activity.description}
                </p>

                {/* Coming soon notice */}
                <div className="mt-auto mb-3 bg-gray-50/70 border border-gray-100/90 rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Launching Soon</span>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      <BookingModal
        sport={selectedSport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hasStayBooking={stayCheck?.hasStayBooking ?? false}
      />
    </div>
  );
}
