'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/hooks/useEvents';
import { useCreateEventBooking } from '@/hooks/useEventBookings';
import { Container } from '@/Components/ui/Container';
import { Button } from '@/Components/ui/Button';
import { Calendar, Users, MapPin, Share, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function EventDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: event, isLoading, isError } = useEvent(slug as string);
  const { mutate: bookEvent, isPending: isBooking } = useCreateEventBooking();

  const [guests, setGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [step, setStep] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Button onClick={() => router.push('/events')}>Back to Events</Button>
      </div>
    );
  }

  const formattedDate = event.isFlexibleDate 
    ? 'Flexible Dates' 
    : new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

  const totalPrice = event.price * guests;
  const coverImage = event.images?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop';

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to book an event.");
      // Could redirect to login modal/page here
      return;
    }

    if (!event.isFlexibleDate && !event.date) {
        alert("Invalid event date.");
        return;
    }

    const finalDate = event.isFlexibleDate ? bookingDate : event.date;
    
    if (!finalDate) {
        alert("Please select a date.");
        return;
    }

    bookEvent({
      eventId: event._id,
      date: finalDate,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    }, {
      onSuccess: () => {
        setStep(2); // Success step
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || "Failed to book event.");
      }
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-24">
      <Container>
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to all events
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-3">
              {event.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-gray-400" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={18} className="mr-2 text-gray-400" />
                <span>Kunnath House Estate</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <Share size={18} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden mb-12 shadow-lg">
          <img 
            src={coverImage} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
              <div 
                className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </section>

            {event.tags && event.tags.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
              {step === 1 ? (
                <>
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className="text-3xl font-bold text-gray-900">₹{event.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">/ person</span>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    {event.isFlexibleDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={event.capacity || 1000}
                        required
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    {!user ? (
                      <div className="p-4 bg-orange-50 text-orange-800 rounded-xl text-sm mb-4">
                        Please login to book this event.
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            required
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                      </>
                    )}

                    <div className="pt-4 mt-6 border-t border-gray-100">
                      <div className="flex justify-between font-bold text-lg mb-6">
                        <span>Total Price</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <Button 
                        type="submit" 
                        fullWidth 
                        size="lg" 
                        className="py-4 text-lg font-bold rounded-xl"
                        disabled={!user || isBooking}
                      >
                        {isBooking ? 'Processing...' : 'Book Now'}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Requested!</h3>
                  <p className="text-gray-500 mb-6">We have received your booking request for {event.title}. Our team will contact you shortly to confirm the details.</p>
                  <Button variant="outline" fullWidth onClick={() => router.push('/events')}>
                    Explore More Events
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
