'use client';

import React from 'react';
import { Star, ArrowRight, BedDouble, Users } from 'lucide-react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useStays } from '@/hooks/useStays';
import { SectionHeading } from '@/Components/ui/SectionHeading';
import StayCardSlider from '@/Components/stays/StayCardSlider';

export default function FarmStaysPage() {
    const { data: stays, isLoading } = useStays();

    return (
        <div className="py-12 bg-white min-h-screen">
            <Container className="max-w-[1440px]">
                {/* <SectionHeading
                    badge="✨ Exclusive Stay"
                    subtitle="Experience the perfect blend of luxury and nature. Choose from our curated collection of premium stays."
                >
                    Stays
                </SectionHeading> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {isLoading ? (
                        Array(4).fill(0).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100" />
                        ))
                    ) : (stays ? [...stays].sort((a, b) => {
                        const order: Record<string, number> = { 'Orange': 1, 'Lemon': 2, 'Mint': 3, 'Lotus': 4 };
                        return (order[a.name] || 99) - (order[b.name] || 99);
                    }) : []).map((stay) => (
                        <Link href={`/stays/${stay._id}`} key={stay._id} className="block group">
                            <Card className="overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 rounded-[28px]">
                                <div className="aspect-[16/10] relative overflow-hidden rounded-[20px] m-2">
                                    <StayCardSlider 
                                        images={stay.images} 
                                        stayName={stay.name} 
                                        stayId={stay._id}
                                        description={stay.description}
                                        bedrooms={stay.bedrooms}
                                        capacity={stay.capacity}
                                        price={stay.price}
                                        weekendPrice={stay.weekendPrice}
                                    />
                                </div>
                                <div className="p-4 pt-1 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-lg font-black tracking-tight text-primary leading-tight group-hover:text-primary/80 transition-colors duration-500">
                                            {stay.name} Farm Stay
                                        </h3>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white px-2.5 py-1 rounded-full transition-all duration-300 flex-shrink-0">
                                            View Stay <ArrowRight size={11} />
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3.5">
                                        <div className="flex items-center gap-1">
                                            <BedDouble size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-500">{stay.bedrooms} BHK</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-500">Up to {stay.capacity} Guests</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-1.5">
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/60 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Weekday</span>
                                            <span className="text-sm font-black text-gray-900">{formatCurrency(stay.price)}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/60 border border-gray-100 transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Weekend</span>
                                            <span className="text-sm font-black text-gray-900">{formatCurrency(stay.weekendPrice || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
}
