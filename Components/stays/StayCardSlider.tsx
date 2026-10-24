'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { IoShareOutline } from 'react-icons/io5';
import { cn, getOptimizedImageUrl } from '@/lib/utils';
import ShareModal from './ShareModal';
import AvailabilityModal from './AvailabilityModal';

interface StayCardSliderProps {
  images: string[];
  stayName: string;
  stayId: string;
  description?: string;
  bedrooms?: number;
  capacity?: number;
  hideBhk?: boolean;
  price?: number;
  weekendPrice?: number;
  showAvailabilityOnImage?: boolean;
}

export default function StayCardSlider({ images = [], stayName, stayId, description, bedrooms, capacity, hideBhk = false, price, weekendPrice, showAvailabilityOnImage = true }: StayCardSliderProps) {
  const displayImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative w-full h-full group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Check Availability & Share Buttons */}
      <div className={cn(
        "absolute top-3 left-3 right-3 z-20 flex items-center pointer-events-none",
        showAvailabilityOnImage ? "justify-between" : "justify-end"
      )}>
        {showAvailabilityOnImage && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAvailabilityOpen(true);
            }}
            className={cn(
              "h-7 sm:h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-md pointer-events-auto",
              "bg-white/95 hover:bg-white hover:scale-105 active:scale-95",
              "text-gray-800 text-[11px] sm:text-xs font-bold border border-gray-100/80 backdrop-blur-sm"
            )}
            title="Check Availability"
            aria-label="Check Availability"
          >
            <Calendar size={13} className="text-primary" />
            <span>Check Availability</span>
          </button>
        )}

        <button
          onClick={handleShare}
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md pointer-events-auto",
            "bg-white/95 hover:bg-white hover:scale-110 active:scale-90",
            "text-gray-800 backdrop-blur-sm border border-gray-100/80"
          )}
          title="Share stay"
          aria-label="Share this stay"
        >
          <IoShareOutline size={16} className="group-hover/slider:rotate-12 transition-transform" />
        </button>
      </div>

      <AvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
        stay={{
          _id: stayId,
          name: stayName,
          price: price || 0,
          weekendPrice: weekendPrice,
          images: displayImages,
        }}
      />

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={stayName}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/stays/${stayId}`}
        image={displayImages[0]}
        bedrooms={hideBhk ? undefined : bedrooms}
        capacity={capacity}
      />

      {/* Images Container */}
      <div className="relative w-full h-full overflow-hidden rounded-[24px]">
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayImages.map((src, idx) => (
            <div key={idx} className="w-full h-full flex-none overflow-hidden">
              <img
                src={getOptimizedImageUrl(src, 600)}
                alt={`${stayName} - ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Desktop Only) */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-between px-3 pointer-events-none transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Pagination Dots (Limited to 5) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
        {displayImages.slice(0, 5).map((_, idx) => {
          const isSelected = displayImages.length <= 5 
            ? currentIndex === idx 
            : Math.floor(currentIndex / (displayImages.length / 5)) === idx;

          return (
            <div
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm",
                isSelected
                  ? "bg-white scale-125 w-2" 
                  : "bg-white/60"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
