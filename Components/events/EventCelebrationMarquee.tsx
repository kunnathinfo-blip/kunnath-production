'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface CelebrationType {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const CELEBRATIONS: CelebrationType[] = [
  {
    id: 'haldi',
    title: 'Haldi & Mehndi',
    subtitle: 'Vibrant outdoor ceremonies with natural backdrops',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'bachelor',
    title: 'Bachelor & Bachelorette Parties',
    subtitle: 'Private pool villas, music & memorable nights',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'gettogethers',
    title: 'Family Get-Togethers',
    subtitle: 'Expansive lush green lawns for all generations',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'birthdays',
    title: 'Birthday Parties',
    subtitle: 'Festive poolside decor and curated event setups',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'kitty',
    title: 'Kitty Parties & High Teas',
    subtitle: 'Scenic daytime gatherings in serene surroundings',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'engagements',
    title: 'Engagements & Pre-Weddings',
    subtitle: 'Romantic ambiance, lighting & bespoke decor',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'corporate',
    title: 'Corporate Offsites & Retreats',
    subtitle: 'Team bonding away from city hustle with sports & stays',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'poolside',
    title: 'Sundowner & Pool Parties',
    subtitle: 'Crystal clear pools surrounded by tranquil nature',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=900&auto=format&fit=crop',
  },
];

export default function EventCelebrationMarquee() {
  // Duplicate array for seamless infinite looping
  const marqueeItems = [...CELEBRATIONS, ...CELEBRATIONS];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-[#FAFAFA] to-white overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3.5 py-1.5 rounded-full border border-red-100">
          <Sparkles size={14} /> Celebrations at Kunnath House
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight mt-3">
          Whatever the Celebration, We Have the Space
        </h2>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mt-3 font-normal">
          From intimate ceremonies to grand festivities, craft your moments in our picturesque private farm venues.
        </p>
      </div>

      {/* Marquee Track Container with subtle fade edges */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right gradient masks for smooth visual blending */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-white via-white/70 to-transparent" />

        <div className="flex w-max gap-5 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[280px] sm:w-[320px] md:w-[360px] h-[340px] sm:h-[380px] flex-shrink-0 relative rounded-[28px] overflow-hidden shadow-soft border border-gray-200/70 group/card transition-all duration-500 hover:shadow-hover hover:-translate-y-1.5"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />

              {/* Top Accent Pill */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white/95 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                  Celebration
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mb-1.5 leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS for infinite linear scrolling and reduced motion */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marqueeScroll 42s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 32s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}
