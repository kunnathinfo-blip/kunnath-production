'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IoShareOutline } from 'react-icons/io5';
import { cn, getOptimizedImageUrl } from '@/lib/utils';
import ShareModal from './ShareModal';

interface StayCardSliderProps {
  images: string[];
  stayName: string;
  stayId: string;
  description?: string;
  bedrooms?: number;
  capacity?: number;
}

export default function StayCardSlider({ images, stayName, stayId, description, bedrooms, capacity }: StayCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
      {/* Share Button (Top Right) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleShare}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
            "bg-white/90 hover:bg-white hover:scale-110 active:scale-90",
            "text-gray-800"
          )}
          title="Share stay"
          aria-label="Share this stay"
        >
          <IoShareOutline size={18} className="group-hover/slider:rotate-12 transition-transform" />
        </button>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={stayName}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/stays/${stayId}`}
        image={images[0]}
        bedrooms={bedrooms}
        capacity={capacity}
      />

      {/* Images Container */}
      <div className="relative w-full h-full overflow-hidden rounded-[24px]">
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, idx) => (
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
        {images.slice(0, 5).map((_, idx) => {
          // If total images > 5, we show 5 dots that represent a window
          // For simplicity and matching "show only 5 dots", we'll just show 5
          // and highlight the one corresponding to (currentIndex % 5) or similar
          // But usually, users just want a cleaner look.
          const isSelected = images.length <= 5 
            ? currentIndex === idx 
            : Math.floor(currentIndex / (images.length / 5)) === idx;

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
