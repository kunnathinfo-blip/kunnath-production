import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Sport } from '@/hooks/useSports';
import { useSportAvailability, useCreateSportBooking, useCreateSportPaymentOrder, useVerifySportPayment } from '@/hooks/useSportBookings';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/Components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface BookingModalProps {
  sport: Sport | null;
  isOpen: boolean;
  onClose: () => void;
  hasStayBooking: boolean;
}

const WHATSAPP_NUMBER = '918143245959';

export default function BookingModal({ sport, isOpen, onClose, hasStayBooking }: BookingModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    note: ''
  });

  const { data: availability, isLoading: checkingAvailability } = useSportAvailability(
    sport?._id || '', 
    selectedDate
  );

  const { mutate: createBooking, isPending: isBookingPending } = useCreateSportBooking();
  const { mutate: createSportPaymentOrder, isPending: isOrderPending } = useCreateSportPaymentOrder();
  const { mutate: verifySportPayment, isPending: isVerifyPending } = useVerifySportPayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const isBooking = isBookingPending || isOrderPending || isVerifyPending || isProcessingPayment;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate('');
      setSelectedSlots([]);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        note: ''
      });
    }
  }, [isOpen, user]);

  if (!isOpen || !sport) return null;

  const bookedSlots = availability?.bookedSlots || [];
  const duration = selectedSlots.length;
  const totalPrice = sport.price * duration;

  // Generate next 14 days
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  // Generate time slots (6:00 to 23:00 for practical use)
  const timeSlots = Array.from({ length: 24 }).map((_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );

  const isSlotPast = (slot: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate !== today) return false;
    const currentHour = new Date().getHours();
    const slotHour = parseInt(slot.split(':')[0]);
    return slotHour <= currentHour;
  };

  const isSlotBooked = (slot: string) => bookedSlots.includes(slot);
  const isSlotDisabled = (slot: string) => isSlotPast(slot) || isSlotBooked(slot);

  // Handle slot click — range selection logic (like check-in / check-out)
  const handleSlotClick = (slot: string) => {
    if (isSlotDisabled(slot)) return;

    const slotHour = parseInt(slot.split(':')[0]);

    // If no slots selected yet → this is the "start" slot
    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    const startHour = parseInt(selectedSlots[0].split(':')[0]);

    // If clicking the same slot that's already selected alone → deselect
    if (selectedSlots.length === 1 && selectedSlots[0] === slot) {
      setSelectedSlots([]);
      return;
    }

    // If clicking the start slot when range is selected → reset to just start
    if (slot === selectedSlots[0]) {
      setSelectedSlots([slot]);
      return;
    }

    // If clicking a slot BEFORE the start → make this the new start
    if (slotHour < startHour) {
      setSelectedSlots([slot]);
      return;
    }

    // If clicking a slot AFTER the start → try to build a consecutive range
    const rangeLength = slotHour - startHour + 1;

    // Max 3 hours
    if (rangeLength > 3) {
      // Reset and start from clicked slot
      setSelectedSlots([slot]);
      return;
    }

    // Check all slots in the range are available
    const rangeSlots: string[] = [];
    for (let h = startHour; h <= slotHour; h++) {
      const s = `${h.toString().padStart(2, '0')}:00`;
      if (isSlotDisabled(s)) {
        // Can't build range through a disabled slot — start fresh
        setSelectedSlots([slot]);
        return;
      }
      rangeSlots.push(s);
    }

    setSelectedSlots(rangeSlots);
  };

  // Determine visual state of each slot
  const getSlotState = (slot: string): 'disabled' | 'booked' | 'start' | 'middle' | 'end' | 'single' | 'available' => {
    if (isSlotBooked(slot)) return 'booked';
    if (isSlotPast(slot)) return 'disabled';

    if (selectedSlots.length === 0) return 'available';
    if (selectedSlots.length === 1 && selectedSlots[0] === slot) return 'single';

    const idx = selectedSlots.indexOf(slot);
    if (idx === -1) return 'available';
    if (idx === 0) return 'start';
    if (idx === selectedSlots.length - 1) return 'end';
    return 'middle';
  };

  const getEndTime = () => {
    if (selectedSlots.length === 0) return '';
    const lastHour = parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0]);
    return `${(lastHour + 1).toString().padStart(2, '0')}:00`;
  };

  const handleBooking = async () => {
    if (!user) return;
    setIsProcessingPayment(true);

    // Dynamically ensure Razorpay script is loaded
    const isLoaded = await new Promise((resolve) => {
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
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      setIsProcessingPayment(false);
      return;
    }

    createSportPaymentOrder(
      {
        sport: sport._id,
        date: selectedDate,
        timeSlots: selectedSlots,
        duration: selectedSlots.length,
        userDetails: formData
      },
      {
        onSuccess: (data) => {
          try {
            // Open Razorpay Popup
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_StVO3LfXhJKkY1", // Razorpay key from env or fallback
              amount: data.order.amount,
              currency: data.order.currency,
              name: "Kunnath House",
              description: `Sports booking for ${sport.name}`,
              image: "/logo.png",
              order_id: data.order.id,
              handler: function (response: any) {
                // Verify Payment securely on backend
                verifySportPayment(
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: data.bookingId
                  },
                  {
                    onSuccess: (verifyData) => {
                      setPaymentDetails({
                        paymentId: response.razorpay_payment_id,
                        bookingId: data.bookingId,
                        amount: data.order.amount / 100
                      });
                      setStep(4);
                    },
                    onError: (error: any) => {
                      alert(error.response?.data?.message || 'Payment verification failed');
                    },
                    onSettled: () => {
                      setIsProcessingPayment(false);
                    }
                  }
                );
              },
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
              },
              theme: {
                color: "#111827"
              },
              modal: {
                ondismiss: function () {
                  setIsProcessingPayment(false);
                }
              }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } catch (err: any) {
            console.error('Razorpay initialization error:', err);
            alert('Could not open Razorpay checkout: ' + (err.message || err));
            setIsProcessingPayment(false);
          }
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Failed to create payment order');
          setIsProcessingPayment(false);
        }
      }
    );
  };

  const getWhatsAppUrl = () => {
    const message = encodeURIComponent(
      `Hi, I'd like to book a sports session.\n` +
      `🏟 Sport: ${sport.name}\n` +
      `👤 Name: ${user?.name || 'Guest'}\n\n` +
      `I don't have an active stay booking. Could you assist me with booking this sports session?`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  // ── Stay Restriction Modal ──
  if (!hasStayBooking) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-8 pt-10 pb-8 text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/60 rounded-full transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Stay Booking Required</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To book sports slots, please book a stay first or contact us for assistance.
            </p>
          </div>
          <div className="px-8 pb-8 pt-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                {sport.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900">{sport.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(sport.price)} / hr</p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/20 hover:shadow-xl hover:scale-[1.02]"
            >
              <FaWhatsapp size={22} />
              Chat on WhatsApp
            </a>
            <Button
              variant="outline"
              fullWidth
              size="lg"
              className="border-2 border-gray-200 hover:border-gray-900 text-gray-700 font-bold rounded-2xl"
              onClick={onClose}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Slot style classes ──
  const slotStyles: Record<string, string> = {
    booked: 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed line-through',
    disabled: 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed',
    available: 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer',
    single: 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 cursor-pointer',
    start: 'bg-primary text-white border-primary rounded-r-none shadow-lg shadow-primary/20 cursor-pointer',
    middle: 'bg-primary/80 text-white border-primary/60 rounded-none cursor-pointer',
    end: 'bg-primary text-white border-primary rounded-l-none shadow-lg shadow-primary/20 cursor-pointer',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900">Book {sport.name}</h2>
            <p className="text-sm text-gray-500">{formatCurrency(sport.price)} per hour • Up to 3 hours</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary' : 'bg-gray-100'}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className={step >= 1 ? 'text-primary' : ''}>Schedule</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Details</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* ── STEP 1: Date & Time Selection ── */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">

              {/* Date Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Select Date
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => { setSelectedDate(d.date); setSelectedSlots([]); }}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 snap-center transition-all ${
                        selectedDate === d.date
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-100 hover:border-primary/30 text-gray-600'
                      }`}
                    >
                      <div className="text-xs uppercase font-medium">{d.dayName}</div>
                      <div className="text-2xl font-bold my-1">{d.dayNumber}</div>
                      <div className="text-xs">{d.month}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Picker — Range Selection */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> Select Time Slots
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Tap a start time, then tap an end time to select up to 3 consecutive hours.
                  </p>

                  {checkingAvailability ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                      Checking availability...
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                      {timeSlots.map((slot) => {
                        const state = getSlotState(slot);
                        const disabled = state === 'booked' || state === 'disabled';
                        return (
                          <button
                            key={slot}
                            disabled={disabled}
                            onClick={() => handleSlotClick(slot)}
                            className={`p-2.5 text-sm font-semibold border-2 transition-all duration-150 rounded-xl ${slotStyles[state]}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Legend */}
                  <div className="flex items-center gap-5 mt-4 text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-white border-2 border-gray-200"></div> Available
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-primary"></div> Selected
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Booked
                    </div>
                  </div>

                  {/* Selection Summary */}
                  {selectedSlots.length > 0 && (
                    <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-primary" />
                          <div>
                            <span className="text-sm font-bold text-gray-900">
                              {selectedSlots[0]} — {getEndTime()}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({duration} {duration === 1 ? 'hour' : 'hours'})
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-black text-primary">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                      {duration > 1 && (
                        <p className="text-[11px] text-gray-400 mt-2 ml-7">
                          {formatCurrency(sport.price)} × {duration} hours
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full mt-6"
                size="lg"
                disabled={!selectedDate || selectedSlots.length === 0}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {/* ── STEP 2: User Details ── */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold">Your Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Any special requests? (Optional)</label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[100px]"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="flex-1"
                  disabled={!formData.name || !formData.email || !formData.phone}
                  onClick={() => setStep(3)}
                >
                  Review Booking
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Summary ── */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold">Booking Summary</h3>
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Sport</p>
                    <p className="font-semibold text-gray-900">{sport.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-primary text-xl">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{selectedSlots[0]} — {getEndTime()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{duration} {duration === 1 ? 'hour' : 'hours'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Rate</p>
                    <p className="font-medium text-gray-900">{formatCurrency(sport.price)} × {duration}hr</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guest Details</p>
                  <p className="font-medium text-gray-900">{formData.name}</p>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                  <p className="text-sm text-gray-600">{formData.phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button
                  className="flex-1"
                  isLoading={isBooking}
                  onClick={handleBooking}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                <CheckCircle2 size={36} className="text-green-500 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Your {duration}-hour slot for <span className="font-bold text-gray-900">{sport.name}</span> on {selectedDate} from {selectedSlots[0]} to {getEndTime()} has been successfully reserved.
              </p>
              
              {paymentDetails && (
                <div className="bg-gray-50 rounded-2xl p-4 text-left max-w-md mx-auto mb-8 border border-gray-100 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Booking ID:</span>
                    <span className="font-mono font-medium text-gray-900">{paymentDetails.bookingId}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment ID:</span>
                    <span className="font-mono font-medium text-gray-900">{paymentDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-primary">{formatCurrency(paymentDetails.amount)}</span>
                  </div>
                </div>
              )}

              <Button onClick={onClose} className="w-full sm:w-auto px-8" size="lg">
                Return to Sports
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
