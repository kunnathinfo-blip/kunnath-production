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
            <Container>
                {/* <SectionHeading
                    badge="✨ Exclusive Stay"
                    subtitle="Experience the perfect blend of luxury and nature. Choose from our curated collection of premium stays."
                >
                    Stays
                </SectionHeading> */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100" />
                        ))
                    ) : (stays ? [...stays].sort((a, b) => {
                        const order: Record<string, number> = { 'Orange': 1, 'Lemon': 2, 'Mint': 3 };
                        return (order[a.name] || 99) - (order[b.name] || 99);
                    }) : []).map((stay) => (
                        <Link href={`/stays/${stay._id}`} key={stay._id} className="block group">
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
        </div>
    );
}
