'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BedDouble, Users, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/Components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import StayCardSlider from './StayCardSlider';
import AvailabilityModal from './AvailabilityModal';

export interface StayData {
  _id: string;
  name: string;
  images: string[];
  description?: string;
  bedrooms?: number;
  capacity?: number;
  price: number;
  weekendPrice?: number;
}

interface StayCardProps {
  stay: StayData;
}

export default function StayCard({ stay }: StayCardProps) {
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const handleOpenAvailability = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAvailabilityOpen(true);
  };

  return (
    <>
      <Link href={`/stays/${stay._id}`} className="block group h-full">
        <Card className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 rounded-[28px]">
          {/* Image Slider */}
          <div className="aspect-[16/10] relative overflow-hidden rounded-[22px] m-2.5">
            <StayCardSlider
              images={stay.images}
              stayName={stay.name}
              stayId={stay._id}
              description={stay.description}
              bedrooms={stay.bedrooms}
              capacity={stay.capacity}
              price={stay.price}
              weekendPrice={stay.weekendPrice}
              showAvailabilityOnImage={false}
            />
          </div>

          {/* Card Body */}
          <div className="p-4 pt-1 flex flex-col flex-1">
            {/* Title & View Stay */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-black tracking-tight text-primary leading-tight group-hover:text-primary/80 transition-colors duration-300">
                {stay.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white px-2.5 py-1 rounded-full transition-all duration-300 flex-shrink-0">
                View Stay <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Badges: BHK & Guests */}
            <div className="flex items-center gap-3 mb-3.5 text-gray-500 font-bold text-xs">
              <div className="flex items-center gap-1.5">
                <BedDouble size={14} className="text-gray-400" />
                <span>{stay.bedrooms} BHK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                <span>Up to {stay.capacity} Guests</span>
              </div>
            </div>

            {/* Combined Pricing Section: Weekday & Weekend in one seamlessly blended card */}
            <div className="mt-auto mb-3 bg-gray-50/70 border border-gray-100/90 rounded-2xl p-3 transition-colors duration-300 group-hover:bg-gray-50/90">
              <div className="grid grid-cols-2 gap-3 divide-x divide-gray-200/70">
                {/* Weekday */}
                <div className="flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                    Weekday
                  </span>
                  <div className="text-sm sm:text-base font-bold text-gray-500 tracking-tight">
                    {formatCurrency(stay.price)}
                  </div>
                </div>

                {/* Weekend */}
                <div className="pl-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                    Weekend
                  </span>
                  <div className="text-sm sm:text-base font-bold text-gray-500 tracking-tight">
                    {formatCurrency(stay.weekendPrice || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Check Availability Button positioned at the bottom */}
            <button
              type="button"
              onClick={handleOpenAvailability}
              className="w-full py-2.5 px-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] group/btn cursor-pointer"
            >
              <Calendar size={13} className="text-primary group-hover/btn:text-white transition-colors" />
              <span>Check Availability</span>
            </button>
          </div>
        </Card>
      </Link>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
        stay={{
          _id: stay._id,
          name: stay.name,
          price: stay.price,
          weekendPrice: stay.weekendPrice,
          images: stay.images,
        }}
      />
    </>
  );
}
