'use client';

import React from 'react';
import { Star, ArrowRight, BedDouble, Users } from 'lucide-react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useStays } from '@/hooks/useStays';
import { SectionHeading } from '@/Components/ui/SectionHeading';
import StayCard from '@/Components/stays/StayCard';

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
                        <StayCard key={stay._id} stay={stay} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
