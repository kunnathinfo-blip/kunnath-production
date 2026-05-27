import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Calendar, Users, ArrowRight, MapPin } from 'lucide-react';
import { Event } from '../../hooks/useEvents';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const coverImage = event.images?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop';
  
  const formattedDate = event.isFlexibleDate 
    ? 'Flexible Dates' 
    : new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

  return (
    <Link href={`/events/${event.slug}`} className="block group h-full">
      <Card className="h-full flex flex-col border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-3xl overflow-hidden transform group-hover:-translate-y-2">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={coverImage} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Glassmorphism Category Badge */}
          <div className="absolute top-4 left-4 backdrop-blur-md bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg">
            {event.category}
          </div>

          {/* Price Highlight */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl border border-white/50">
            <span className="text-xs text-gray-500 font-medium mr-1">Starts at</span>
            ₹{event.price.toLocaleString()}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Featured Event
          </div>

          <h3 className="font-display font-bold text-2xl text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
            {event.shortDescription}
          </p>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-50">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Date</span>
                <span className="font-semibold truncate">{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                <MapPin size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Location</span>
                <span className="font-semibold truncate">Kunnath House</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <Button 
              fullWidth 
              className="py-4 text-sm font-bold rounded-2xl bg-gray-900 text-white hover:bg-primary border-none shadow-lg group-hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Book This Experience <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
