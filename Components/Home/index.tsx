
'use client';

import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Search, ArrowRight, BedDouble, Users } from 'lucide-react';
import { formatCurrency, getOptimizedImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { useStays } from '@/hooks/useStays';
import { useSports } from '@/hooks/useSports';
import { useHashScroll } from '@/hooks/useHashScroll';
import StayCardSlider from '../stays/StayCardSlider';
import { SkeletonStayCard } from '../ui/SkeletonStayCard';
import { SkeletonSportCard } from '../ui/SkeletonSportCard';

export default function Home() {
    const { data: stays, isLoading: isLoadingStays } = useStays();
    const { data: sports, isLoading: isLoadingSports } = useSports();
    useHashScroll();

    return (
        <div className="pb-16">
            {/* 1. HERO SECTION */}
            {/* <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop)' }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-6 drop-shadow-lg font-display">
                        Escape. Indulge. Reconnect.
                    </h1>
                    <p className="text-xl text-white/90 text-center mb-12 max-w-2xl drop-shadow-md">
                        Experience the ultimate luxury farm stay. Disconnect from the city and immerse yourself in nature.
                    </p>

                   
                    <div className="bg-white rounded-full p-2 w-full max-w-4xl shadow-xl flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="flex-1 w-full px-6 py-3 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
                            <div className="text-xs font-bold text-gray-800">Location</div>
                            <div className="text-sm text-gray-500">Kunnath House</div>
                        </div>
                        <div className="flex-1 w-full px-6 py-3 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
                            <div className="text-xs font-bold text-gray-800">Check in</div>
                            <div className="text-sm text-gray-500">Add dates</div>
                        </div>
                        <div className="flex-1 w-full px-6 py-3 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
                            <div className="text-xs font-bold text-gray-800">Check out</div>
                            <div className="text-sm text-gray-500">Add dates</div>
                        </div>
                        <div className="flex-1 w-full pl-6 pr-2 py-2 flex items-center justify-between hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
                            <div>
                                <div className="text-xs font-bold text-gray-800">Guests</div>
                                <div className="text-sm text-gray-500">Add guests</div>
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white p-4 rounded-full transition-colors shadow-md">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* 2. FARM STAYS PREVIEW */}
            <section id="stays" className="pt-8 pb-10">

                <Container>
                    {/* <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Luxury Stays</h2>
                            <p className="text-gray-500">Discover your perfect escape</p>
                        </div>
                        <Link href="/stays" className="text-primary font-medium hover:underline flex items-center">
                            View all <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingStays ? (
                            <>
                                <SkeletonStayCard />
                                <SkeletonStayCard />
                                <SkeletonStayCard />
                            </>
                        ) : (stays ? [...stays].sort((a, b) => {
                            const order: Record<string, number> = { 'Orange': 1, 'Lemon': 2, 'Mint': 3 };
                            return (order[a.name] || 99) - (order[b.name] || 99);
                        }) : []).map((stay) => (
                            <Link href={`/stays/${stay._id}`} key={stay._id} className="block group animate-in fade-in duration-500">
                                <Card className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 rounded-[32px]">
                                    <div className="aspect-[16/10] relative overflow-hidden rounded-[24px] m-2.5">
                                        <StayCardSlider 
                                            images={stay.images} 
                                            stayName={stay.name} 
                                            stayId={stay._id}
                                            description={stay.description}
                                            bedrooms={stay.bedrooms}
                                            capacity={stay.capacity}
                                        />
                                    </div>
                                    <div className="p-6 pt-2 flex flex-col flex-1">
                                        <h3 className="text-xl font-black tracking-tighter text-primary leading-none mb-3 group-hover:text-primary/80 transition-colors duration-500">
                                            {stay.name} Farm Stay
                                        </h3>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <BedDouble size={13} className="text-gray-400" />
                                                <span className="text-[11px] font-bold text-gray-500">{stay.bedrooms} BHK</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={13} className="text-gray-400" />
                                                <span className="text-[11px] font-bold text-gray-500">Up to {stay.capacity} Guests</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weekdays</span>
                                                <span className="text-base font-black text-gray-900">{formatCurrency(stay.price)}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weekends</span>
                                                <span className="text-base font-black text-gray-900">{formatCurrency(stay.weekendPrice || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="activities" className="py-24 bg-white">
                <Container>
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest mb-3 block">Experiences</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Sports & Activities</h2>
                        </div>
                        <Link href="/sports" className="group flex items-center gap-2 text-gray-900 font-bold hover:text-primary transition-colors bg-gray-100 px-6 py-3 rounded-full">
                            Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {isLoadingSports ? (
                            <>
                                <SkeletonSportCard />
                                <SkeletonSportCard />
                                <SkeletonSportCard />
                                <SkeletonSportCard />
                            </>
                        ) : sports?.slice(0, 4).map((activity, idx) => (
                            <Link href="/sports" key={idx} className="block group relative h-[420px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in duration-500">
                                <img
                                    src={getOptimizedImageUrl(activity.image, 500)}
                                    alt={activity.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                <div className="absolute top-6 left-6">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30">
                                        {activity.icon}
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{activity.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white/80 font-medium">
                                            {formatCurrency(activity.price)}
                                            <span className="text-white/60 text-sm font-normal ml-1">/ {activity.duration}</span>
                                        </p>
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 4. EVENTS PREVIEW */}
            <section className="py-20">
                <Container>
                    <div className="bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0 z-0 opacity-40">
                            <img
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop"
                                alt="Events"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 max-w-3xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
                                Host Your Dream Event
                            </h2>
                            <p className="text-lg text-gray-200 mb-8">
                                Weddings • Corporate Retreats • Private Parties
                                <br />
                                Create unforgettable memories at Kunnath House.
                            </p>
                            {/* <Link href="/events">
                                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold border-0">
                                    Inquire Now
                                </Button>
                            </Link> */}
                            <Link
                                href="/events"
                                style={{
                                    display: "inline-block",
                                    padding: "12px 24px",
                                    backgroundColor: "#ffffff",
                                    color: "#111827",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    borderRadius: "6px",
                                    border: "none"
                                }}
                            >
                                Inquire Now
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 5. CTA SECTION */}
            {/* <section className="py-16 text-center">
                <Container>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to disconnect?</h2>
                    <Link href="/stays">
                        <Button size="lg" className="px-10">
                            Book Your Stay
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="lg" className="px-10">
                            Contact Us
                        </Button>
                    </Link>
                </Container>
            </section> */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-1 mb-4 text-sm font-medium tracking-wide text-gray-600 uppercase bg-gray-100 rounded-full">
                            Escape the Noise
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Ready to disconnect?
                        </h2>

                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            Slow down, breathe deeply, and reconnect with nature in a peaceful stay designed for rest and simplicity.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/stays">
                                <Button
                                    size="lg"
                                    className="px-10 py-6 text-base font-semibold shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    Book Your Stay
                                </Button>
                            </Link>

                            <Link href="/contact">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-10 py-6 text-base font-semibold border-gray-300 hover:bg-gray-100 transition-all duration-300"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}