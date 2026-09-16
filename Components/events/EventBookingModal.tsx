'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Users, CheckCircle, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { FarmStay, useStayDetails } from '@/hooks/useStays';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import {
  EVENT_PRICING_DETAILS,
  EVENT_CELEBRATION_TYPES,
  EventCelebrationType
} from '@/lib/constants/events';
import {
  useCreateEventPaymentOrder,
  useVerifyEventPayment
} from '@/hooks/useEventBookings';

interface EventBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: FarmStay | null;
}

export function EventBookingModal({ isOpen, onClose, stay }: EventBookingModalProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  // Fetch stay details to get latest shared unavailableDates
  const { data: stayDetails, refetch: refetchStayDetails } = useStayDetails(stay?._id || '');

  const { mutate: createEventOrder, isPending: isOrderPending } = useCreateEventPaymentOrder();
  const { mutate: verifyEventPayment, isPending: isVerifyPending } = useVerifyEventPayment();

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [gatheringSize, setGatheringSize] = useState('');
  const [eventType, setEventType] = useState<EventCelebrationType>(EVENT_CELEBRATION_TYPES[0]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    paymentId: string;
    amount: number;
    stayName: string;
    date: string;
    gatheringSize: string;
    eventType: string;
  } | null>(null);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      if (!guestName && user.name) setGuestName(user.name);
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user, isOpen]);

  // Pricing details based on selected stay
  const stayKey = useMemo(() => {
    return (stay?.name || '').toLowerCase().trim();
  }, [stay]);

  const pricingDetails = useMemo(() => {
    return EVENT_PRICING_DETAILS[stayKey] || {
      occupancy: 'upto 100 Guests',
      overnightStay: 'Overnight stay up to 15 members',
      tiers: [{ label: 'Standard Gathering', price: stay?.price || 35000 }],
      securityDeposit: 10000,
      securityDepositNote: '₹ 10,000 security deposit extra (refundable)',
    };
  }, [stayKey, stay]);

  // Default gathering size when stay changes
  useEffect(() => {
    if (pricingDetails.tiers && pricingDetails.tiers.length > 0) {
      setGatheringSize(pricingDetails.tiers[0].label);
    }
  }, [pricingDetails]);

  // Selected tier & price
  const selectedTier = useMemo(() => {
    return pricingDetails.tiers.find(t => t.label === gatheringSize) || pricingDetails.tiers[0];
  }, [pricingDetails, gatheringSize]);

  // Shared unavailable dates list
  const unavailableDates = useMemo(() => {
    return stayDetails?.unavailableDates || [];
  }, [stayDetails]);

  // Minimum selectable date (tomorrow or today)
  const minDateStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  if (!isOpen || !stay) return null;

  const eventTitle = `Event at ${stay.name} Stay`;

  const handleDateChange = (val: string) => {
    setErrorMessage('');
    if (unavailableDates.includes(val)) {
      setErrorMessage('This date is already booked or blocked for this venue. Please select another date.');
      setEventDate('');
      return;
    }
    setEventDate(val);
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setGuestName('');
    setPhone('');
    setEmail('');
    setEventDate('');
    setSpecialRequests('');
    setTermsAccepted(false);
    setErrorMessage('');
    setIsProcessing(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      router.push('/login?redirect=/events');
      return;
    }

    if (!eventDate) {
      setErrorMessage('Please select an event date.');
      return;
    }

    if (unavailableDates.includes(eventDate)) {
      setErrorMessage('This date is already booked. Please choose an available date.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the booking and payment terms to proceed.');
      return;
    }

    setIsProcessing(true);

    // Dynamically ensure Razorpay script is loaded
    const isLoaded = await new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!isLoaded) {
      setErrorMessage('Failed to load Razorpay payment SDK. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    // Step 1: Create event order on backend
    createEventOrder({
      stayId: stay._id,
      date: eventDate,
      gatheringSize: selectedTier.label,
      eventType,
      guestName,
      guestEmail: email || 'no-email@kunnath.com',
      guestPhone: phone,
      specialRequests,
      termsAccepted: true,
    }, {
      onSuccess: (data) => {
        try {
          // Step 2: Launch Razorpay checkout popup
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_StVO3LfXhJKkY1',
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'Kunnath House',
            description: `${eventTitle} - ${selectedTier.label}`,
            image: '/logo.png',
            order_id: data.order.id,
            handler: function (response: any) {
              // Step 3: Verify Payment securely on backend
              verifyEventPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.bookingId,
              }, {
                onSuccess: () => {
                  setConfirmedBooking({
                    bookingId: data.bookingId,
                    paymentId: response.razorpay_payment_id,
                    amount: selectedTier.price,
                    stayName: stay.name,
                    date: eventDate,
                    gatheringSize: selectedTier.label,
                    eventType,
                  });
                  refetchStayDetails();
                  setIsProcessing(false);
                },
                onError: (err: any) => {
                  setErrorMessage(err.response?.data?.message || 'Payment verification failed. Please contact support.');
                  setIsProcessing(false);
                },
              });
            },
            prefill: {
              name: guestName,
              email: email || 'no-email@kunnath.com',
              contact: phone,
            },
            theme: {
              color: '#1a1a1a',
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (resp: any) {
            setErrorMessage(`Payment Failed: ${resp.error.description}`);
            setIsProcessing(false);
          });
          rzp.open();

        } catch (err: any) {
          console.error('Razorpay initialization error:', err);
          setErrorMessage('Could not open Razorpay checkout: ' + (err.message || err));
          setIsProcessing(false);
        }
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to create payment order. Please try again.';
        setErrorMessage(msg);
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {confirmedBooking ? (
          /* Confirmation View */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Event Booking Confirmed!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              Your private event reservation at <span className="font-bold text-gray-900">{confirmedBooking.stayName} Stay</span> has been confirmed.
            </p>

            {/* Booking Summary Box */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Event Type</span>
                <span className="font-bold text-gray-900">{confirmedBooking.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Event Date</span>
                <span className="font-bold text-gray-900">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Gathering Size</span>
                <span className="font-bold text-gray-900">{confirmedBooking.gatheringSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-bold text-emerald-700 text-sm">{formatCurrency(confirmedBooking.amount)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-500">
                <span>Payment ID</span>
                <span className="font-mono text-[11px]">{confirmedBooking.paymentId}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs text-left">
              ℹ️ <strong>Security Deposit:</strong> ₹10,000 refundable security deposit will be collected prior to check-in and returned upon inspection after the event.
            </div>

            <div className="pt-2">
              <Button fullWidth onClick={handleResetAndClose} size="lg" className="rounded-2xl">
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase mb-2">
              <Sparkles size={14} /> Private Event Booking
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
              {eventTitle}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Select your gathering size, celebration type, and preferred date to book directly.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px] font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800">
                🌙 {pricingDetails.overnightStay}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200/70 text-red-700">
                + {pricingDetails.securityDepositNote}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Type / Celebration Dropdown (Host a Booking) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Event / Celebration Type *
                </label>
                <select
                  required
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventCelebrationType)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 cursor-pointer font-medium"
                >
                  {EVENT_CELEBRATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gathering Size Selection (Dynamically determines price) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <Users size={13} /> Gathering Size & Package *
                </label>
                <select
                  required
                  value={gatheringSize}
                  onChange={(e) => setGatheringSize(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 cursor-pointer font-medium"
                >
                  {pricingDetails.tiers.map((tier) => (
                    <option key={tier.label} value={tier.label}>
                      {tier.label} — {formatCurrency(tier.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar size={13} /> Preferred Event Date *
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={eventDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  * Dates booked for Stays or other Events are automatically blocked.
                </p>
              </div>

              {/* Guest Details */}
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

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Event Notes / Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about special decor, timings, or catering requirements..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Selected Package:</span>
                  <span className="font-semibold text-gray-900">{selectedTier.label}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Event Venue Fee:</span>
                  <span className="font-bold text-gray-900 text-sm">{formatCurrency(selectedTier.price)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 pt-1 border-t border-gray-200/60">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-medium text-gray-700">₹10,000 (at check-in)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                  <span>Total Due Online:</span>
                  <span className="text-primary text-base">{formatCurrency(selectedTier.price)}</span>
                </div>
              </div>

              {/* Terms Acceptance Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="eventTerms"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="eventTerms" className="text-xs text-gray-600 cursor-pointer">
                  I agree to the booking terms, house rules, and understand that ₹10,000 refundable security deposit is payable before check-in.
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isProcessing || isOrderPending || isVerifyPending}
                  className="py-4 text-base font-bold rounded-2xl shadow-lg cursor-pointer"
                >
                  Confirm & Pay {formatCurrency(selectedTier.price)}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
