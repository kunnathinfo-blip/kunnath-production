'use client';

import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { 
  Crown, 
  Sparkles, 
  Home, 
  Ticket, 
  Trophy, 
  Bike, 
  Car, 
  Heart, 
  Utensils, 
  Rocket, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  X,
  Instagram,
  Globe
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import MembershipPosterSlider from '@/Components/membership/MembershipPosterSlider';
import JoinMembershipModal from '@/Components/membership/JoinMembershipModal';

const POSTERS = ['/membership.jpeg', '/membershippp.jpeg'];

const BENEFITS = [
  {
    icon: <Home className="w-5 h-5 text-amber-600" />,
    title: '2 Complimentary Family Farmstays',
    badge: '₹20,000+ Value',
    description: '2BHK private farmhouse stays at Orange or Lotus for up to 10–12 guests. Includes private pool & lawn access.',
  },
  {
    icon: <Ticket className="w-5 h-5 text-orange-600" />,
    title: '3 Stay Discount Vouchers',
    badge: '₹15,000 Total Off',
    description: '₹5,000 off each on three additional farmhouse bookings throughout your 2-year membership.',
  },
  {
    icon: <Trophy className="w-5 h-5 text-emerald-600" />,
    title: 'Complimentary Team Sports',
    badge: 'With Every Stay',
    description: '2 hours of Box Cricket, Sand Volleyball, and Human Foosball included with every eligible farmhouse reservation.',
  },
  {
    icon: <Bike className="w-5 h-5 text-red-600" />,
    title: '15 Adventure Rides Laps',
    badge: 'Adults & Kids',
    description: '15 complimentary laps of ATV & Dirt Bike rides on our custom off-road dirt circuit with every eligible farmhouse booking.',
  },
  {
    icon: <Car className="w-5 h-5 text-blue-600" />,
    title: 'RC Car Experiences',
    badge: 'Interactive Fun',
    description: 'RC Car Sumo Challenge plus a 30-minute hobby-grade remote control car drive across our custom hurdle tracks.',
  },
  {
    icon: <Heart className="w-5 h-5 text-pink-600" />,
    title: 'Family & Kids Fun Zone',
    badge: 'All Ages',
    description: 'Complimentary access to the Kids’ Pet & Play Zone, exotic bird aviary interaction, and indoor recreation games.',
  },
  {
    icon: <Utensils className="w-5 h-5 text-purple-600" />,
    title: 'Member Dining & Privileges',
    badge: 'VIP Status',
    description: 'Special member discounts on catering and food menus, priority reservation windows, and VIP access to upcoming resort attractions.',
  },
];

const UPCOMING_2027 = [
  { title: 'High-Speed RC Off-Roading', note: 'Up to 100 kmph speed trials', emoji: '🏎️' },
  { title: 'Cottages & Service Apartments', note: 'Extended countryside stays', emoji: '🏡' },
  { title: 'Open-Air IPL & T20 Screenings', note: 'Giant outdoor stadium displays', emoji: '🏏' },
  { title: 'Fishing Pond & Live BBQ', note: 'Catch & grill fresh stations', emoji: '🎣' },
  { title: 'Stargazing & Camping Tents', note: 'Under the night sky glamping', emoji: '🔭' },
  { title: 'Kids’ Zipline & Play Park', note: 'High-wire adventure fun', emoji: '🪁' },
  { title: 'Snookball (Football Billiards)', note: 'Giant pool table game', emoji: '⚽' },
  { title: 'Golf Snooker Green', note: 'Precision putting greens', emoji: '⛳' },
];

export default function MembershipPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [zoomPosterIndex, setZoomPosterIndex] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white py-12 sm:py-16 border-b border-gray-100">
        <Container className="max-w-[1440px]">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Crown Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
              <Crown size={15} className="text-amber-600" />
              <span>Founder Member Programme • Limited Enrolments</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4 font-display">
              Kunnath House <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Gold Membership</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium mb-6">
              Two years of private luxury stays, adventure rides & unforgettable family memories.
            </p>

            {/* Price Pill & Single CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-2.5 sm:p-3 rounded-3xl border border-gray-200/90 shadow-xl shadow-amber-500/5">
              <div className="px-5 py-2 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Membership Fee
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {formatCurrency(29999)}
                  </span>
                  <span className="text-xs font-bold text-gray-500">/ 2 Years</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Crown size={18} />
                <span>Join Membership</span>
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 text-xs text-gray-500 font-bold">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-600" />
                <span>Validity: <strong className="text-gray-900">2 Full Years</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>Pre-Launch: <strong className="text-gray-900">11 Oct 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Benefits Begin: <strong className="text-gray-900">25 Nov 2026</strong></span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MAIN SHOWCASE: POSTER SLIDER & HIGHLIGHTS */}
      <section className="py-12 sm:py-16">
        <Container className="max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT: Auto-scrolling Poster Window */}
            <div className="lg:col-span-5">
              <Card className="rounded-[32px] p-3 border border-gray-100 bg-white shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08)] flex flex-col">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-black tracking-wider uppercase text-gray-700">Official Posters</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">Auto-Scrolling</span>
                </div>

                {/* Auto-scroll poster slider */}
                <MembershipPosterSlider
                  posters={POSTERS}
                  onOpenZoom={(idx) => setZoomPosterIndex(idx)}
                  autoPlayInterval={4000}
                />

                {/* Bottom Bar on Poster */}
                <div className="p-4 pt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Swipe or click arrows to view slides</span>
                    <button
                      onClick={() => setZoomPosterIndex(0)}
                      className="font-bold text-primary hover:underline cursor-pointer"
                    >
                      Enlarge Poster
                    </button>
                  </div>

                  <Button
                    fullWidth
                    size="md"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="py-3 rounded-xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Join Membership • ₹29,999
                  </Button>
                </div>
              </Card>
            </div>

            {/* RIGHT: Benefits Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-amber-600 mb-1.5 block">
                  Exclusive Privileges
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  Your Membership Benefits
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enjoy over ₹80,000+ worth of stays, sports, and recreation perks across 2 years.
                </p>
              </div>

              {/* Benefits Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BENEFITS.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-amber-200 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {b.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                          {b.badge}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-gray-900 leading-snug mb-1 group-hover:text-primary transition-colors">
                        {b.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Founder Guarantee Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={28} className="text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                      Exclusive Circle Guarantee
                    </h4>
                    <p className="text-xs text-gray-600">
                      Limited membership slots released. Enrolments close once the initial founder batch is filled.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="shrink-0 px-5 py-2.5 rounded-xl font-black bg-gray-900 hover:bg-black text-white text-xs cursor-pointer shadow-sm"
                >
                  Enrol Now
                </Button>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 3. COMING SOON IN 2027 SECTION */}
      <section className="py-12 bg-gray-50/70 border-y border-gray-100">
        <Container className="max-w-[1440px]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-primary inline-flex items-center gap-1.5 mb-1.5">
                <Rocket size={14} /> The Future of Kunnath
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Coming Soon in 2027
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Members get automatic priority access and special privileges for upcoming mega attractions.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsJoinModalOpen(true)}
              className="rounded-xl border-gray-300 text-gray-800 font-bold hover:bg-white cursor-pointer"
            >
              Enquire on WhatsApp
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {UPCOMING_2027.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex items-start gap-3"
              >
                <span className="text-2xl shrink-0 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  {item.emoji}
                </span>
                <div>
                  <h4 className="text-xs font-black text-gray-900 leading-tight mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-6 italic">
            * Benefits are subject to availability and membership terms. Upcoming attractions are planned for 2027; opening dates may vary.
          </p>
        </Container>
      </section>

      {/* 4. FOOTER CALL-TO-ACTION BANNER */}
      <section className="pt-12">
        <Container className="max-w-[1440px]">
          <div className="rounded-[32px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Crown size={14} /> Founder Batch Closing Soon
              </span>

              <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
                Secure Your Founder Place Today
              </h2>

              <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
                Reply <strong>GOLD</strong> to enquire, confirm availability, and secure your 2-year membership at Kunnath House.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Crown size={18} />
                  <span>Join Gold Membership • ₹29,999</span>
                </Button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
                <a
                  href="tel:7900306655"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Phone size={13} className="text-primary" />
                  <span>7900306655</span>
                </a>
                <a
                  href="tel:7702402505"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Phone size={13} className="text-primary" />
                  <span>7702402505</span>
                </a>
                <a
                  href="https://instagram.com/kunnath_farmhouse"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <Instagram size={13} className="text-pink-400" />
                  <span>@kunnath_farmhouse</span>
                </a>
                <span className="text-gray-500">
                  Kunnath House Arya Pvt Ltd
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Join Membership Modal */}
      <JoinMembershipModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        price={29999}
      />

      {/* Fullscreen Poster Zoom Modal */}
      {zoomPosterIndex !== null && (
        <div 
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setZoomPosterIndex(null)}
        >
          <button
            onClick={() => setZoomPosterIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          <div 
            className="relative max-w-3xl max-h-[94vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={POSTERS[zoomPosterIndex]}
              alt={`Kunnath Gold Membership Poster ${zoomPosterIndex + 1}`}
              className="max-w-full max-h-[92vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}