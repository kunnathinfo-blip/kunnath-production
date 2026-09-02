'use client';

import React, { useState } from 'react';
import { X, Calendar, Users, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { FarmStay } from '@/hooks/useStays';

interface EventBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: FarmStay | null;
}

export function EventBookingModal({ isOpen, onClose, stay }: EventBookingModalProps) {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(10);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !stay) return null;

  const eventTitle = `Event at ${stay.name} Stay`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate booking action (User will set future booking API logic here)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setGuestName('');
    setPhone('');
    setEmail('');
    setEventDate('');
    setSpecialRequests('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Booking Inquiry Received!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Thank you for requesting to book <span className="font-bold text-gray-900">{eventTitle}</span>. Our team will contact you shortly to finalize your event details.
            </p>
            <div className="pt-4">
              <Button fullWidth onClick={handleResetAndClose} size="lg" className="rounded-2xl">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase mb-2">
              <Sparkles size={14} /> Private Event Booking
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
              {eventTitle}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your details below to reserve {stay.name} Stay for your upcoming event.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                    <Calendar size={13} /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                    <Users size={13} /> Estimated Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Event Notes / Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your event (e.g. Birthday, Wedding, Corporate retreat...)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  className="py-4 text-base font-bold rounded-2xl shadow-lg"
                >
                  Book Event
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
