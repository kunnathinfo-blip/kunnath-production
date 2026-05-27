'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/Components/ui/Container';
import { Search } from 'lucide-react';
import { EventGrid } from '@/Components/events/EventGrid';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Traditional' | 'Corporate' | 'Upcoming'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const tabs = ['All', 'Upcoming', 'Traditional', 'Corporate'];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <Container className="relative z-10 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Unforgettable Moments</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Discover Events
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From festive celebrations to premium corporate retreats, find and book exclusive events at Kunnath House.
          </p>
        </Container>
      </section>

      <Container className="-mt-10 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
          
          {/* Tabs */}
          <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
        </div>

        {/* Dynamic Grid */}
        <EventGrid category={activeTab} search={debouncedSearchTerm} />

      </Container>
    </div>
  );
}
