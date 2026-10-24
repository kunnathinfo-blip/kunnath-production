'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MembershipPosterSliderProps {
  posters: string[];
  onOpenZoom?: (index: number) => void;
  autoPlayInterval?: number;
}

export default function MembershipPosterSlider({
  posters = ['/membership.jpeg', '/membershippp.jpeg'],
  onOpenZoom,
  autoPlayInterval = 4000,
}: MembershipPosterSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scrolling timer (pauses when user hovers)
  useEffect(() => {
    if (isHovered || posters.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, posters.length, autoPlayInterval]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[26px] bg-gray-900 group/slider select-none shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider track */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posters.map((src, idx) => (
          <div
            key={idx}
            className="w-full h-full flex-none relative cursor-pointer"
            onClick={() => onOpenZoom && onOpenZoom(idx)}
          >
            <img
              src={src}
              alt={`Kunnath Gold Membership Poster ${idx + 1}`}
              className="w-full h-full object-contain sm:object-cover bg-black/90 transition-transform duration-700 group-hover/slider:scale-[1.02]"
            />
            {/* Subtle zoom overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-2 text-xs font-bold backdrop-blur-[2px]">
              <ZoomIn size={18} />
              <span>Tap to View Fullscreen</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {posters.length > 1 && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-between px-3 pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"
          )}
        >
          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 pointer-events-auto backdrop-blur-sm"
            aria-label="Previous Poster"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 pointer-events-auto backdrop-blur-sm"
            aria-label="Next Poster"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Auto-scroll Pagination Dots */}
      {posters.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {posters.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "rounded-full transition-all duration-300",
                currentIndex === idx
                  ? "bg-amber-400 w-5 h-1.5"
                  : "bg-white/60 hover:bg-white w-1.5 h-1.5"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
