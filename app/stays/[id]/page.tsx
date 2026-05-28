// 'use client';

// import React from 'react';
// import { Container } from '@/Components/ui/Container';
// import { Button } from '@/Components/ui/Button';
// import { Card } from '@/Components/ui/Card';
// import { Menu, X, User, Phone, LogOut, Instagram, Star, Share, Heart, Plus, Minus, ChevronDown, ChevronUp, Clock, MapPin, Shield, Home, Utensils, Maximize2, Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Wifi, Droplet, Coffee, Car, Wind } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { useStayDetails } from '@/hooks/useStays';
// import { useState } from 'react';
// import { useCreateBooking } from '@/hooks/useBookings';
// import { useAuthStore } from '@/store/authStore';

// export default function StayDetailsPage() {
//   const params = useParams();
//   const stayId = params.id as string;
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const { data: stayData, isLoading } = useStayDetails(stayId);
//   const { mutate: createBooking, isPending } = useCreateBooking();

//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [guests, setGuests] = useState(1);

//   if (isLoading) {
//     return <div className="py-20 text-center text-gray-500">Loading stay details...</div>;
//   }

//   if (!stayData) {
//     return <div className="py-20 text-center text-gray-500">Stay not found</div>;
//   }

//   const dummyAmenities = [
//       { name: 'Fast Wifi', icon: <Wifi size={24} className="text-gray-700" /> },
//       { name: 'Private Pool', icon: <Droplet size={24} className="text-gray-700" /> },
//       { name: 'Kitchen', icon: <Coffee size={24} className="text-gray-700" /> },
//       { name: 'Free Parking', icon: <Car size={24} className="text-gray-700" /> },
//       { name: 'Air Conditioning', icon: <Wind size={24} className="text-gray-700" /> },
//     ];

//   return (
//     <div className="py-8 pb-24">
//       <Container>
//         {/* Title and Info */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{stayData.name}</h1>
//           <div className="flex items-center text-sm text-gray-600 space-x-4">
//             <span className="flex items-center font-medium text-gray-900">
//               <Star size={16} className="mr-1 fill-current" /> {stayData.rating}
//             </span>
//             <span className="underline cursor-pointer hover:text-gray-900">{stayData.reviews} reviews</span>
//             <span>·</span>
//             <span className="underline cursor-pointer hover:text-gray-900">Kunnath House, India</span>
//           </div>
//         </div>

//         {/* Image Gallery (Airbnb Style) */}
//         <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 mb-10 h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
//           <div className="md:col-span-2 md:row-span-2 relative cursor-pointer hover:opacity-90 transition-opacity">
//             <img src={stayData.images[0]} alt="Main" className="w-full h-full object-cover" />
//           </div>
//           <div className="hidden md:block relative cursor-pointer hover:opacity-90 transition-opacity">
//             <img src={stayData.images[1]} alt="Gallery 1" className="w-full h-full object-cover" />
//           </div>
//           <div className="hidden md:block relative cursor-pointer hover:opacity-90 transition-opacity">
//             <img src={stayData.images[2]} alt="Gallery 2" className="w-full h-full object-cover" />
//           </div>
//           <div className="hidden md:block relative cursor-pointer hover:opacity-90 transition-opacity">
//             <img src={stayData.images[3]} alt="Gallery 3" className="w-full h-full object-cover" />
//           </div>
//           <div className="hidden md:block relative cursor-pointer hover:opacity-90 transition-opacity">
//             <img src={stayData.images[4]} alt="Gallery 4" className="w-full h-full object-cover" />
//           </div>
//         </div>

//         {/* Content Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

//           {/* Left Column (Details) */}
//           <div className="lg:col-span-2 space-y-10">
//             {/* Hosted by summary */}
//             <div className="flex justify-between items-center pb-6 border-b border-gray-200">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Entire farm stay hosted by Kunnath</h2>
//                 <p className="text-gray-600 mt-1">{stayData.capacity} guests · {stayData.beds} beds · 4 baths</p>
//               </div>
//               <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
//                 <span className="font-bold text-gray-500">KH</span>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="pb-8 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About this space</h2>
//               <p className="text-gray-600 leading-relaxed">
//                 {stayData.description}
//               </p>
//             </div>

//             {/* Amenities */}
//             <div className="pb-8 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">What this place offers</h2>
//               <div className="grid grid-cols-2 gap-y-4">
//                 {dummyAmenities.map((amenity, idx) => (
//                   <div key={idx} className="flex items-center space-x-4">
//                     {amenity.icon}
//                     <span className="text-gray-700">{amenity.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column (Sticky Booking Card) */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28">
//               <Card className="p-6 shadow-xl border-gray-200">
//                 <div className="mb-6">
//                   <span className="text-2xl font-bold text-gray-900">₹{stayData.price.toLocaleString()}</span>
//                   <span className="text-gray-500"> / night</span>
//                 </div>

//                 <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
//                   <div className="flex border-b border-gray-300">
//                     <div className="flex-1 p-3 border-r border-gray-300 focus-within:bg-gray-50">
//                       <div className="text-[10px] uppercase font-bold text-gray-800">Check-in</div>
//                       <input 
//                         type="date" 
//                         className="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 cursor-pointer"
//                         value={checkIn}
//                         onChange={(e) => setCheckIn(e.target.value)}
//                         min={new Date().toISOString().split('T')[0]}
//                       />
//                     </div>
//                     <div className="flex-1 p-3 focus-within:bg-gray-50">
//                       <div className="text-[10px] uppercase font-bold text-gray-800">Check-out</div>
//                       <input 
//                         type="date" 
//                         className="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 cursor-pointer"
//                         value={checkOut}
//                         onChange={(e) => setCheckOut(e.target.value)}
//                         min={checkIn || new Date().toISOString().split('T')[0]}
//                       />
//                     </div>
//                   </div>
//                   <div className="p-3 w-full flex justify-between items-center hover:bg-gray-50 transition-colors">
//                     <div className="w-full">
//                       <div className="text-[10px] uppercase font-bold text-gray-800">Guests</div>
//                       <select 
//                         className="w-full text-sm text-gray-700 bg-transparent outline-none mt-1 appearance-none cursor-pointer"
//                         value={guests}
//                         onChange={(e) => setGuests(Number(e.target.value))}
//                       >
//                         {[...Array(stayData.capacity || 1)].map((_, i) => (
//                           <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'guest' : 'guests'}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <ChevronDown size={20} className="text-gray-600 pointer-events-none" />
//                   </div>
//                 </div>

//                 {(() => {
//                   const calculateNights = () => {
//                     if (!checkIn || !checkOut) return 1;
//                     const start = new Date(checkIn);
//                     const end = new Date(checkOut);
//                     const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
//                     return diffDays > 0 ? diffDays : 1;
//                   };

//                   const nights = calculateNights();
//                   const basePrice = stayData.price * nights;
//                   const cleaningFee = 2000;
//                   const serviceFee = 1500;

//                   let discountAmount = 0;
//                   let discountPercent = 0;

//                   if (user?.isMember) {
//                     if (user.membershipType === 'silver') discountPercent = 10;
//                     else if (user.membershipType === 'gold') discountPercent = 20;
//                     else if (user.membershipType === 'premium') discountPercent = 30;

//                     discountAmount = (basePrice * discountPercent) / 100;
//                   }

//                   const subTotal = basePrice - discountAmount;
//                   const totalPrice = subTotal + cleaningFee + serviceFee;

//                   const handleReserve = () => {
//                     if (!checkIn || !checkOut) {
//                       alert('Please select check-in and check-out dates.');
//                       return;
//                     }
//                     createBooking({ stayId, checkIn, checkOut, guests, totalPrice }, {
//                       onSuccess: () => {
//                         alert('Booking confirmed successfully!');
//                         router.push('/');
//                       },
//                       onError: (error: any) => {
//                         alert(error.response?.data?.message || 'Error creating booking. Are you logged in?');
//                       }
//                     });
//                   };

//                   return (
//                     <>
//                       <Button 
//                         size="lg" 
//                         fullWidth 
//                         className="mb-4" 
//                         onClick={handleReserve}
//                         disabled={isPending}
//                       >
//                         {isPending ? 'Reserving...' : 'Reserve'}
//                       </Button>

//                       <p className="text-center text-sm text-gray-500 mb-6">
//                         You won't be charged yet
//                       </p>

//                       <div className="space-y-4 pb-4 border-b border-gray-200">
//                         <div className="flex justify-between text-gray-600">
//                           <span className="underline cursor-pointer">₹{stayData.price.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
//                           <span>₹{basePrice.toLocaleString()}</span>
//                         </div>

//                         {user?.isMember && discountAmount > 0 && (
//                           <div className="flex justify-between text-green-600 font-medium">
//                             <span>{user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)} Discount ({discountPercent}%)</span>
//                             <span>-₹{discountAmount.toLocaleString()}</span>
//                           </div>
//                         )}

//                         <div className="flex justify-between text-gray-600">
//                           <span className="underline cursor-pointer">Cleaning fee</span>
//                           <span>₹{cleaningFee.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between text-gray-600">
//                           <span className="underline cursor-pointer">Kunnath service fee</span>
//                           <span>₹{serviceFee.toLocaleString()}</span>
//                         </div>
//                       </div>

//                       <div className="flex justify-between pt-4 font-bold text-gray-900 text-lg">
//                         <span>Total before taxes</span>
//                         <span>{formatCurrency(totalPrice)}</span>
//                       </div>
//                     </>
//                   );
//                 })()}
//               </Card>
//             </div>
//           </div>

//         </div>
//       </Container>
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@/Components/ui/Container';
import { Button } from '@/Components/ui/Button';
import { Card } from '@/Components/ui/Card';
import {
  Star, Wifi, Droplet, Coffee, Car, Wind, Tv, Snowflake, Utensils,
  Waves, Dumbbell, Flame, Briefcase, Shield, Calendar as CalendarIcon,
  MapPin, ChevronDown, ChevronUp, Heart, Share, Home, Clock,
  CheckCircle, X, Maximize2, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  Plus, Minus
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useStayDetails } from '@/hooks/useStays';
import { useCreateBooking, useCreatePaymentOrder, useVerifyPayment } from '@/hooks/useBookings';
import { useAuthStore } from '@/store/authStore';

import { formatCurrency, cn, getOptimizedImageUrl } from '@/lib/utils';
import ShareModal from '@/Components/stays/ShareModal';
import TermsModal from '@/Components/stays/TermsModal';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// ---------- TIMEZONE-SAFE DATE HELPERS ----------
function getTodayLocal(): string {
  const today = new Date();
  return today.toLocaleDateString('en-CA');
}

function localDateFromString(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalYMD(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

function calculateNightsLocal(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = localDateFromString(checkIn);
  const end = localDateFromString(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

function isDateBooked(ymd: string, bookedDates: string[]): boolean {
  return bookedDates.includes(ymd);
}

// ---------- Double Month Availability Calendar (Airbnb Style) ----------
interface AvailabilityCalendarProps {
  bookedDates: string[];
  checkIn: string;
  checkOut: string;
  onDateSelect: (date: string) => void;
  isPopover?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  bookedDates,
  checkIn,
  checkOut,
  onDateSelect,
  isPopover = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const todayLocal = getTodayLocal();
  const isCheckInActive = !checkIn || !!(checkIn && checkOut);
  const isCheckOutActive = !!(checkIn && !checkOut);

  const goPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const goNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Helper to build a month grid (returns array of dates as YYYY-MM-DD or null)
  const getMonthDays = (date: Date): (string | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(formatLocalYMD(new Date(year, month, d)));
    }
    while (days.length < 42) days.push(null); // 6 rows
    return days;
  };

  const currentMonthDays = getMonthDays(currentMonth);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = getMonthDays(nextMonthDate);

  const handleDateClick = (ymd: string | null) => {
    if (!ymd) return;
    if (isDateBooked(ymd, bookedDates)) return;
    if (ymd < todayLocal) return;

    if (!checkIn || (checkIn && checkOut)) {
      onDateSelect(ymd);
    } else {
      if (ymd > checkIn) {
        // Check if any date in the range [checkIn, ymd] is booked
        const start = new Date(checkIn);
        const end = new Date(ymd);
        let current = new Date(start);
        let hasBookedInRange = false;
        while (current <= end) {
          const dateStr = formatLocalYMD(current);
          if (isDateBooked(dateStr, bookedDates)) {
            hasBookedInRange = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (hasBookedInRange) {
          alert("This range includes already booked dates. Please select another range.");
          return;
        }
        onDateSelect(ymd);
      } else if (ymd < checkIn) {
        onDateSelect(ymd);
      }
    }
  };

  const isSelected = (ymd: string): boolean => ymd === checkIn || ymd === checkOut;
  const isInRange = (ymd: string): boolean => {
    if (!checkIn || !checkOut) return false;
    return ymd > checkIn && ymd < checkOut;
  };
  const isStart = (ymd: string): boolean => ymd === checkIn;
  const isEnd = (ymd: string): boolean => ymd === checkOut;
  const isPast = (ymd: string): boolean => ymd < todayLocal;
  const isBooked = (ymd: string): boolean => isDateBooked(ymd, bookedDates);

  const renderMonth = (monthDate: Date, days: (string | null)[], monthLabel: string) => (
    <div className={cn("flex-1", isPopover ? "min-w-[200px]" : "min-w-[240px]")}>
      <div className="text-center font-semibold text-gray-800 mb-4">{monthLabel}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((ymd, idx) => {
          if (!ymd) return <div key={idx} className="p-2" />;
          const dayNumber = parseInt(ymd.split('-')[2], 10);
          const selected = isSelected(ymd);
          const inRange = isInRange(ymd);
          const start = isStart(ymd);
          const end = isEnd(ymd);
          const past = isPast(ymd);
          const booked = isBooked(ymd);
          const disabled = past || booked;

          let bgClass = '';
          let textClass = 'text-gray-900';
          let roundedClass = '';

          if (selected) {
            bgClass = 'bg-gray-900 text-white';
            textClass = 'text-white';
            roundedClass = 'rounded-full';
          } else if (inRange) {
            bgClass = 'bg-gray-100';
            roundedClass = 'rounded-none';
          }

          if (start) roundedClass = 'rounded-l-full';
          if (end) roundedClass = 'rounded-r-full';

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleDateClick(ymd)}
              className={cn(
                "text-xs transition-colors hover:bg-gray-100",
                isPopover ? "p-1.5" : "p-2",
                roundedClass, bgClass, textClass,
                disabled ? 'text-gray-300 line-through cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  const nextMonthLabel = `${monthNames[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;

  const nights = checkIn && checkOut ? calculateNightsLocal(checkIn, checkOut) : 0;
  const dateRangeStr = checkIn && checkOut
    ? `${localDateFromString(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${localDateFromString(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : 'Select dates';

  return (
    <div className={cn(
      "bg-white rounded-3xl",
      isPopover ? "p-0" : "p-5 border border-gray-200 shadow-sm"
    )}>
      {isPopover && (
        <div className="p-4 sm:p-6 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter leading-none">
              {nights > 0 ? `${nights} nights` : 'Select dates'}
            </h2>
            <p className="text-[11px] sm:text-sm font-bold text-gray-400 mt-2">
              {nights > 0 ? dateRangeStr : 'Add your travel dates for exact pricing'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row border border-gray-900 rounded-2xl overflow-hidden shadow-sm w-full sm:w-auto">
            <div className={cn(
              "px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-900 flex-1 sm:min-w-[140px] transition-all duration-300",
              isCheckInActive ? "bg-gray-100" : "bg-white"
            )}>
              <div className="text-[9px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Check-in</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  {checkIn ? new Date(checkIn).toLocaleDateString('en-GB') : 'Add date'}
                </span>
                {checkIn && (
                  <button onClick={(e) => { e.stopPropagation(); onDateSelect(''); }} className="ml-2 text-gray-400 hover:text-gray-900">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 flex-1 sm:min-w-[140px] transition-all duration-300",
              isCheckOutActive ? "bg-gray-100" : "bg-white"
            )}>
              <div className="text-[9px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Checkout</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  {checkOut ? new Date(checkOut).toLocaleDateString('en-GB') : 'Add date'}
                </span>
                {checkOut && (
                  <button onClick={(e) => { e.stopPropagation(); onDateSelect(checkIn); }} className="ml-2 text-gray-400 hover:text-gray-900">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isPopover && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Select dates</h3>
          <div className="flex gap-1">
            <button onClick={goPrevMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goNextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className={cn("relative", isPopover ? "px-4 sm:px-6 pt-2" : "")}>
        {isPopover && (
          <>
            <button onClick={goPrevMonth} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10">
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
            <button onClick={goNextMonth} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10">
              <ChevronRight size={24} className="text-gray-400" />
            </button>
          </>
        )}

        <div className={cn("flex flex-col sm:flex-row gap-8 justify-between")}>
          {renderMonth(currentMonth, currentMonthDays, currentMonthLabel)}
          {renderMonth(nextMonthDate, nextMonthDays, nextMonthLabel)}
        </div>
      </div>

      {/* <div className={cn("flex justify-between mt-4 text-[10px] text-gray-400 border-t pt-3 pb-2", isPopover ? "px-8 border-none" : "flex")}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 bg-gray-100 rounded"></span> Range</div>
          <div className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 bg-gray-900 rounded-full"></span> Select</div>
          <div className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 bg-white border border-gray-200 rounded overflow-hidden relative"><span className="absolute inset-0 flex items-center justify-center text-gray-200 text-[8px] leading-none">/</span></span> Booked</div>
        </div>
      </div> */}
    </div>
  );
};



// ---------- Main Component (unchanged except calendar import) ----------
export default function StayDetailsPage() {
  const params = useParams();
  const stayId = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: stayData, isLoading, refetch } = useStayDetails(stayId);
  const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();
  const { mutate: createPaymentOrder, isPending: isOrderPending } = useCreatePaymentOrder();
  const { mutate: verifyPayment, isPending: isVerifyPending } = useVerifyPayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null); // To store success details for step 4
  const isPending = isBookingPending || isOrderPending || isVerifyPending || isProcessingPayment;

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const guests = adults + children;
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showReviewText, setShowReviewText] = useState<boolean[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [dynamicImages, setDynamicImages] = useState<string[]>([]);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setIsGuestPickerOpen(false);
      }
    };

    if (isDatePickerOpen || isGuestPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen, isGuestPickerOpen]);

  useEffect(() => {
    if (stayData?.slug) {
      fetch(`/api/gallery/${stayData.slug}`)
        .then(res => res.json())
        .then(data => {
          // New format: { flat: [...], categorized: {...} }
          if (data && Array.isArray(data.flat) && data.flat.length > 0) {
            setDynamicImages(data.flat);
          }
          // Backward compat: old format was a plain array
          else if (Array.isArray(data) && data.length > 0) {
            setDynamicImages(data);
          }
        })
        .catch(err => console.error('Failed to fetch gallery images:', err));
    }
  }, [stayData?.slug]);

  // Progressive booking flow state
  const [step, setStep] = useState(1);

  // Formik configuration for Guest Details form validation
  const formik = useFormik({
    initialValues: {
      guestName: user?.name || '',
      guestEmail: user?.email || '',
      guestPhone: user?.phone || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      guestName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .required('Full Name is required'),
      guestPhone: Yup.string()
        .matches(/^[0-9\-\+\s()]{10,15}$/, 'Please enter a valid phone number')
        .required('Phone Number is required'),
    }),
    onSubmit: () => {
      if (!user) {
        router.push(`/login?redirect=/stays/${stayId}`);
        return;
      }
      setStep(3);
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-gray-900"></div>
        <p className="mt-4 text-gray-500">Loading stay details...</p>
      </div>
    );
  }

  if (!stayData) {
    return <div className="py-20 text-center text-gray-500">Stay not found</div>;
  }

  const {
    name,
    rating = 4.9,
    reviews = 128,
    images = [],
    price = 5000,
    weekendPrice = 6000,
    capacity = 4,
    maxGuests = 4,
    beds = 2,
    bedrooms = 1,
    halls = 0,
    bathrooms = 2,
    description = "Beautiful farm stay with modern amenities.",
    host = {
      name: "Kunnath",
      isSuperhost: true,
      avatar: null,
    },
    amenitiesList = [],
    amenities = [],
    foodOptions = [],
    addOns = [],
    securityDeposit = 5000,
    bookingAdvance = 5000,
    extraGuestCharge = 500,
    reviewList = [],
    location = { address: "Kunnath House, Kompally-Medchal Highway, Jeedipally", lat: 17.5875, lng: 78.4866 },
    houseRules = ["Check-in at 12:00 PM", "Check-out at 10:00 AM"],
    safetyItems = ["Smoke alarm", "First aid kit"],
    cancellationPolicy = "Free cancellation for 48 hours.",
    unavailableDates = []
  } = stayData || {};

  // Strict capacity enforcement based on stay type
  const limitMaxGuests = stayData?.name?.includes('Orange') ? 15 
                       : stayData?.name?.includes('Lemon') ? 20 
                       : stayData?.name?.includes('Mint') ? 15 
                       : maxGuests;

  // const bookedDates = unavailableDates.length > 0 ? unavailableDates : generateMockBookedDates();
  const bookedDates = unavailableDates || [];
  const allAmenities = (amenitiesList?.length ? amenitiesList : amenities) || dummyAmenities.map(a => a.name);
  const displayedAmenities = showAllAmenities ? allAmenities : allAmenities.slice(0, 6);
  const hasMoreAmenities = allAmenities.length > 6;

  const imagesToDisplay = dynamicImages.length > 0 ? dynamicImages : (images.length > 0 ? images : ['/placeholder.jpg']);
  const galleryImages = imagesToDisplay.length >= 5 ? imagesToDisplay : [...imagesToDisplay, ...Array(5 - imagesToDisplay.length).fill(imagesToDisplay[0] || '/placeholder.jpg')];

  // Calculate pricing breakdown
  const calculatePricing = () => {
    if (!checkIn || !checkOut) return { weekdayNights: 0, weekendNights: 0, basePrice: 0 };

    let weekdayNights = 0;
    let weekendNights = 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    let current = new Date(start);
    while (current < end) {
      const day = current.getDay();
      // Friday (5) and Saturday (6) are weekends
      if (day === 5 || day === 6) {
        weekendNights++;
      } else {
        weekdayNights++;
      }
      current.setDate(current.getDate() + 1);
    }

    const calculatedBasePrice = (weekdayNights * price) + (weekendNights * weekendPrice);
    return { weekdayNights, weekendNights, basePrice: calculatedBasePrice };
  };

  const { weekdayNights, weekendNights, basePrice } = calculatePricing();
  const totalNights = weekdayNights + weekendNights;

  // Extra guests calculation
  const extraGuests = guests > capacity ? guests - capacity : 0;
  const extraGuestTotal = extraGuests * extraGuestCharge * totalNights;

  // Add-ons calculation
  const addOnsTotal = addOns
    .filter(a => selectedAddOns.includes(a.name))
    .reduce((sum, a) => sum + a.price, 0);

  const cleaningFee = 0;
  const serviceFee = 0;

  let discountPercent = 0;
  if (user?.isMember) {
    if (user.membershipType === 'silver') discountPercent = 10;
    else if (user.membershipType === 'gold') discountPercent = 20;
    else if (user.membershipType === 'premium') discountPercent = 30;
  }
  const discountAmount = (basePrice * discountPercent) / 100;
  const subtotal = basePrice - discountAmount + extraGuestTotal + addOnsTotal;
  const totalPrice = subtotal + cleaningFee + serviceFee;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    if (!formik.values.guestName || !formik.values.guestPhone) {
      alert('Please fill out all guest details.');
      return;
    }
    
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
    
    // Step 1: Create Order securely on backend
    createPaymentOrder({ stayId, checkIn, checkOut, guests, guestName: formik.values.guestName, guestEmail: formik.values.guestEmail || 'no-email@kunnath.com', guestPhone: formik.values.guestPhone, totalPrice, selectedAddOns, termsAccepted: true }, {
      onSuccess: (data) => {
        try {
          // Step 2: Open Razorpay Popup
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Sq1fM8H5iOEwy0", // Razorpay key from env or fallback
            amount: data.order.amount,
            currency: data.order.currency,
            name: "Kunnath House",
            description: `Booking for ${name}`,
            image: "/logo.png",
            order_id: data.order.id,
            handler: function (response: any) {
              // Step 3: Verify Payment securely on backend
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.bookingId
              }, {
                onSuccess: (verifyData) => {
                  setPaymentDetails({
                    paymentId: response.razorpay_payment_id,
                    bookingId: data.bookingId,
                    amount: totalPrice,
                    stayName: name
                  });
                  refetch();
                  setStep(4);
                  setIsProcessingPayment(false);
                },
                onError: () => {
                  alert('Payment verification failed.');
                  setIsProcessingPayment(false);
                }
              });
            },
            prefill: {
              name: formik.values.guestName,
              email: formik.values.guestEmail || 'no-email@kunnath.com',
              contact: formik.values.guestPhone
            },
            theme: {
              color: "#1a1a1a" // Match premium dark theme
            },
            modal: {
              ondismiss: function() {
                setIsProcessingPayment(false);
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            alert(`Payment Failed: ${response.error.description}`);
            setIsProcessingPayment(false);
          });
          rzp.open();
        } catch (err: any) {
          console.error('Razorpay initialization error:', err);
          alert('Could not open Razorpay checkout: ' + (err.message || err));
          setIsProcessingPayment(false);
        }
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || '';
        if (msg.includes('Not authorized') || msg.includes('token failed')) {
          alert('Please login to proceed with the payment.');
          router.push(`/login?redirect=/stays/${stayId}`);
        } else {
          alert(msg || 'Error creating payment order. Please try again.');
        }
        setIsProcessingPayment(false);
      }
    });
  };

  const openGallery = (index: number) => {
    router.push(`/stays/${stayId}/photos`);
  };

  const handleDateSelect = (dateStr: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut('');
    } else {
      if (dateStr > checkIn) {
        setCheckOut(dateStr);
      } else if (dateStr < checkIn) {
        setCheckIn(dateStr);
        setCheckOut('');
      }
    }
  };

  return (
    <div className="px-12 pt-8 pb-20 bg-white min-h-screen">
      <Container>
        {/* Title & action row */}
        <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{name}</h1>
            {/* <div className="flex items-center text-sm text-gray-500 space-x-3 mt-2">
              <div className="flex items-center">
                <Star size={14} className="fill-primary text-primary mr-1" />
                <span className="font-bold text-gray-900">{rating}</span>
              </div>
              <span>·</span>
              <span className="underline font-medium hover:text-gray-900 transition-colors cursor-pointer">{reviews} reviews</span>
              <span>·</span>
              <span className="underline font-medium hover:text-gray-900 transition-colors cursor-pointer">{location.address.split(',')[0]}</span>
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Share size={14} /> Share
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1.5 mb-8 rounded-xl overflow-hidden h-[260px] md:h-[324px] ">
          <div className="md:col-span-2 md:row-span-2 relative cursor-pointer" onClick={() => openGallery(0)}>
            <img src={getOptimizedImageUrl(galleryImages[0], 800)} alt="Main" className="w-full h-full object-cover hover:opacity-95 transition" />
          </div>
          <div className="hidden md:block relative cursor-pointer" onClick={() => openGallery(1)}>
            <img src={getOptimizedImageUrl(galleryImages[1], 400)} alt="Gallery 1" className="w-full h-full object-cover hover:opacity-95 transition" />
          </div>
          <div className="hidden md:block relative cursor-pointer" onClick={() => openGallery(2)}>
            <img src={getOptimizedImageUrl(galleryImages[2], 400)} alt="Gallery 2" className="w-full h-full object-cover hover:opacity-95 transition" />
          </div>
          <div className="hidden md:block relative cursor-pointer" onClick={() => openGallery(3)}>
            <img src={getOptimizedImageUrl(galleryImages[3], 400)} alt="Gallery 3" className="w-full h-full object-cover hover:opacity-95 transition" />
          </div>
          <div className="hidden md:block relative cursor-pointer" onClick={() => openGallery(4)}>
            <img src={getOptimizedImageUrl(galleryImages[4], 400)} alt="Gallery 4" className="w-full h-full object-cover hover:opacity-95 transition" />
          </div>
          <button
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2 text-sm font-medium shadow-md flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <Maximize2 size={16} /> Show all photos
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="pb-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">About this space</h2>
              <p className="text-gray-600 mt-4 leading-relaxed text-sm whitespace-pre-line">{description}</p>
            </div>

            {/* Amenities */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-5">What this place offers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                {displayedAmenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
              {hasMoreAmenities && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-6 underline font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${allAmenities.length} amenities`}
                  {showAllAmenities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {/* Food Options */}
            {foodOptions && foodOptions.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold mb-5">Food</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {foodOptions.map((option, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Utensils size={20} className="text-gray-700 mt-0.5" />
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {/* {reviews > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <Star size={20} className="fill-current text-gray-900" />
                  <span className="text-xl font-semibold">{rating} · {reviews} reviews</span>
                </div>
                <div className="space-y-6">
                  {reviewList.slice(0, showReviewText.length > 0 ? undefined : 4).map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-5">
                      <div className="font-medium">{review.author}</div>
                      <div className="text-sm text-gray-500 mb-2">{review.date}</div>
                      <p className="text-gray-700">
                        {showReviewText[idx] ? review.text : `${review.text.substring(0, 180)}${review.text.length > 180 ? '...' : ''}`}
                        {review.text.length > 180 && (
                          <button onClick={() => setShowReviewText(prev => {
                            const newArr = [...prev];
                            newArr[idx] = !newArr[idx];
                            return newArr;
                          })} className="ml-2 font-medium text-gray-700 underline">
                            {showReviewText[idx] ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                {reviewList.length > 4 && !showReviewText.length && (
                  <button className="mt-4 underline font-medium text-gray-700">Show all {reviews} reviews</button>
                )}
              </div>
            )} */}

            {/* Double Month Availability Calendar */}
            <div id="availability" className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon size={22} className="text-gray-700" />
                <h2 className="text-xl font-semibold">Availability</h2>
              </div>
              <AvailabilityCalendar
                bookedDates={bookedDates}
                checkIn={checkIn}
                checkOut={checkOut}
                onDateSelect={() => { }} // Disconnected as requested
              />
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Where you'll be</h2>
              <p className="text-sm text-gray-500 mb-6">{location.address}</p>
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1899.982270385572!2d78.46668796405145!3d17.746309875123387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc775bf397e4d1%3A0x830514304966871a!2sKunnath%20House%20Farm%20House!5e0!3m2!1sen!2sin!4v1778741897871!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-6 left-6 hidden sm:block">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-gray-100"
                  >
                    Get Directions <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Home size={16} /> House rules</h3>
                <ul className="text-xs text-gray-500 space-y-2 mb-3">
                  <li className="flex items-start gap-2"><span>•</span> Check-in and check-out timings must be strictly followed.</li>
                  <li className="flex items-start gap-2"><span>•</span> Guests must carry valid government-issued ID proof.</li>
                  <li className="flex items-start gap-2"><span>•</span> No loud music during late-night hours.</li>
                </ul>
                <Link href="/house-rules" className="text-xs font-bold text-gray-900 underline hover:text-gray-600 transition-colors">
                  Read all house rules
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield size={16} /> Health & safety</h3>
                <ul className="text-xs text-gray-500 space-y-2">
                  {safetyItems.map((item: string, i: number) => <li key={i} className="flex items-start gap-2"><span>•</span> {item}</li>)}
                  <li className="flex items-start gap-2"><span>•</span> Pool usage is at guests’ own risk.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={16} /> Cancellation Policy</h3>
                <ul className="text-xs text-gray-500 space-y-2 mb-3">
                  <li className="flex items-start gap-2"><span>•</span> 100% refund if cancelled 7 days prior.</li>
                  <li className="flex items-start gap-2"><span>•</span> 50% refund if cancelled within 2 days.</li>
                  <li className="flex items-start gap-2"><span>•</span> No refund within 48 hours.</li>
                </ul>
                <Link href="/refund-policy" className="text-xs font-bold text-gray-900 underline hover:text-gray-600 transition-colors">
                  Read full policy
                </Link>
              </div>
            </div>

            {/* Guest Policy & Charges */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold mb-4">Pricing & Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h4 className="font-semibold mb-2">Guest Capacity</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Included guests: Up to {capacity} members</li>
                    <li>Extra charge: {formatCurrency(extraGuestCharge)} per additional member</li>
                    <li>Maximum limit: {maxGuests} members</li>
                  </ul>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <h4 className="font-semibold mb-2">Reservations & Payment</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Confirmed upon 50% advance payment</li>
                    <li>Remaining balance due before check-in</li>
                    <li>Refundable Security Deposit: {formatCurrency(securityDeposit)}</li>
                  </ul>
                  <Link href="/terms" className="inline-block mt-3 text-xs font-bold text-gray-900 underline hover:text-gray-600 transition-colors">
                    Read terms & conditions
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="p-6 shadow-xl rounded-2xl border border-gray-200 overflow-visible">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="mb-6 flex flex-col items-center text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">
                          {formatCurrency(totalPrice || price)}
                        </span>
                        {!checkIn || !checkOut && <span className="text-gray-400 text-sm font-medium">/ night</span>}
                      </div>
                      {!checkIn || !checkOut && (
                        <p className="text-[10px] text-gray-400 font-medium mt-1 italic">Price shown for 1 night</p>
                      )}
                    </div>


                    <div className="relative border border-gray-300 rounded-xl mb-4">
                      <div className="flex border-b border-gray-300 relative">
                        <div
                          className="flex-1 p-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => {
                            setIsDatePickerOpen(!isDatePickerOpen);
                            if (!isDatePickerOpen) setIsGuestPickerOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock size={10} className="text-primary" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-tight">In: 12:00 PM</span>
                          </div>
                          <div className="text-[12px] font-black uppercase text-gray-900 tracking-wider">Check-in</div>
                          <div className={cn(
                            "text-[11px] mt-0.5 transition-colors",
                            checkIn ? "font-bold text-gray-900" : "font-normal text-gray-400"
                          )}>
                            {checkIn ? new Date(checkIn).toLocaleDateString('en-GB') : 'Add date'}
                          </div>
                        </div>
                        <div
                          className="flex-1 p-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => {
                            setIsDatePickerOpen(!isDatePickerOpen);
                            if (!isDatePickerOpen) setIsGuestPickerOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock size={10} className="text-primary" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-tight">Out: 10:00 AM</span>
                          </div>
                          <div className="text-[12px] font-black uppercase text-gray-900 tracking-wider">Check-out</div>
                          <div className={cn(
                            "text-[11px] mt-0.5 transition-colors",
                            checkOut ? "font-bold text-gray-900" : "font-normal text-gray-400"
                          )}>
                            {checkOut ? new Date(checkOut).toLocaleDateString('en-GB') : 'Add date'}
                          </div>
                        </div>

                        {/* Date Picker Popover */}
                        {isDatePickerOpen && (
                          <div
                            ref={datePickerRef}
                            className="fixed inset-0 sm:absolute sm:inset-auto sm:top-0 sm:right-0 md:-right-4 lg:-right-8 mt-0 bg-white sm:rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.25)] border-t sm:border border-gray-100 p-0 z-[100] sm:z-50 animate-in fade-in zoom-in-95 duration-200 w-full md:w-[680px] overflow-y-auto sm:overflow-visible"
                          >
                            <AvailabilityCalendar
                              isPopover
                              bookedDates={bookedDates}
                              checkIn={checkIn}
                              checkOut={checkOut}
                              onDateSelect={(date) => {
                                handleDateSelect(date);
                                if (checkIn && !checkOut) setIsDatePickerOpen(false);
                              }}
                            />
                            <div className="flex justify-end px-8 pb-8">
                              <button
                                onClick={() => setIsDatePickerOpen(false)}
                                className="bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95 flex items-center gap-2"
                              >
                                <span>Close</span>
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Guest Picker Trigger */}
                      <div
                        className="p-3 w-full flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors rounded-b-xl"
                        onClick={() => {
                          setIsGuestPickerOpen(!isGuestPickerOpen);
                          if (!isGuestPickerOpen) setIsDatePickerOpen(false);
                        }}
                      >
                        <div className="w-full">
                          <div className="text-[12px] font-black uppercase text-gray-900 tracking-wider">Guests</div>
                          <div className="text-base font-medium text-gray-700 mt-1">
                            {guests} guest{guests > 1 ? 's' : ''}{infants > 0 ? `, ${infants} infant${infants > 1 ? 's' : ''}` : ''}{pets > 0 ? `, ${pets} pet${pets > 1 ? 's' : ''}` : ''}
                          </div>
                        </div>
                        <ChevronDown size={18} className={cn("text-gray-400 transition-transform", isGuestPickerOpen && "rotate-180")} />
                      </div>

                      {/* Guest Picker Popover */}
                      {isGuestPickerOpen && (
                        <div
                          ref={guestPickerRef}
                          className="absolute top-full left-0 right-0 mt-2 bg-gray-50 rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 space-y-6 animate-in fade-in zoom-in-95 duration-200"
                        >
                          {/* Adults */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">Adults</div>
                              <div className="text-xs text-gray-400">Age 13+</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={adults}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) setAdults(Math.max(1, val));
                                }}
                                className="w-8 text-center font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => setAdults(adults + 1)}
                                disabled={guests >= limitMaxGuests}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">Children</div>
                              <div className="text-xs text-gray-400">Ages 2–12</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={children}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) setChildren(Math.max(0, val));
                                }}
                                className="w-8 text-center font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => setChildren(children + 1)}
                                disabled={guests >= limitMaxGuests}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>


                          {/* Pets */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">Pets</div>
                              <div className="text-xs text-gray-400 underline cursor-pointer">Bringing a service animal?</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setPets(Math.max(0, pets - 1))}
                                disabled={pets <= 0}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                value={pets}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) setPets(Math.min(1, Math.max(0, val)));
                                }}
                                className="w-8 text-center font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => setPets(Math.min(1, pets + 1))}
                                disabled={pets >= 1}
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            {guests >= limitMaxGuests ? (
                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">Maximum capacity reached</span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium">Maximum {limitMaxGuests} guests allowed</span>
                            )}
                            <button
                              onClick={() => setIsGuestPickerOpen(false)}
                              className="text-sm font-bold text-gray-900 hover:underline"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>


                    {/* Add-ons selection in booking card */}
                    {addOns && addOns.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase text-gray-800 mb-2">Optional Add-ons</div>
                        <div className="space-y-2">
                          {addOns
                            .filter(addon => addon.name !== 'Kitchen') // Filter out Kitchen as requested
                            .map((addon) => (
                            <label key={addon.name} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                                  checked={selectedAddOns.includes(addon.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAddOns([...selectedAddOns, addon.name]);
                                    } else {
                                      setSelectedAddOns(selectedAddOns.filter(a => a !== addon.name));
                                    }
                                  }}
                                />
                                <span className="text-sm font-medium">{addon.name}</span>
                              </div>
                              <span className="text-sm text-gray-600">₹{addon.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="lg"
                      fullWidth
                      className="mb-3"
                      onClick={() => {
                        if (!checkIn || !checkOut) {
                          alert('Please select dates.');
                          return;
                        }
                        if (!user) {
                          router.push(`/login?redirect=/stays/${stayId}`);
                          return;
                        }
                        setStep(2);
                      }}
                    >
                      Reserve
                    </Button>
                    <p className="text-center text-sm text-gray-500">You won't be charged yet</p>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={formik.handleSubmit} className="animate-in fade-in slide-in-from-right-4 text-left">
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium underline mb-4 flex items-center gap-1 hover:text-gray-600">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Guest Details</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="guestName"
                          value={formik.values.guestName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={cn(
                            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all",
                            formik.touched.guestName && formik.errors.guestName ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                          )}
                          placeholder="John Doe"
                        />
                        {formik.touched.guestName && formik.errors.guestName && (
                          <p className="mt-1 text-xs text-red-500 font-medium">{formik.errors.guestName}</p>
                        )}
                      </div>
                      {/* Email field removed per user request */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="guestPhone"
                          value={formik.values.guestPhone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={cn(
                            "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all",
                            formik.touched.guestPhone && formik.errors.guestPhone ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                          )}
                          placeholder="+91 9876543210"
                        />
                        {formik.touched.guestPhone && formik.errors.guestPhone && (
                          <p className="mt-1 text-xs text-red-500 font-medium">{formik.errors.guestPhone}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      fullWidth
                    >
                      Continue
                    </Button>
                  </form>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <button onClick={() => setStep(2)} className="text-sm font-medium underline mb-4 flex items-center gap-1 hover:text-gray-600">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <h3 className="text-xl font-bold mb-4">Review & Confirm</h3>

                    <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm text-gray-800 border border-gray-200">
                      <div className="mb-2"><span className="font-semibold">Dates:</span> {checkIn} to {checkOut}</div>
                      <div className="mb-2"><span className="font-semibold">Guests:</span> {guests}</div>
                      <div><span className="font-semibold">Guest:</span> {formik.values.guestName}</div>
                    </div>

                            <div className="mt-4 mb-6 text-left animate-in fade-in duration-300">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Payment Summary</h4>
                      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                        {/* Top: Stay Pricing Breakdown */}
                        <div className="space-y-2.5 pb-4 border-b border-gray-200/80 text-xs">
                          {weekdayNights > 0 && (
                            <div className="flex justify-between text-gray-600 font-medium">
                              <span>{formatCurrency(price)} × {weekdayNights} weekday {weekdayNights === 1 ? 'night' : 'nights'}</span>
                              <span>{formatCurrency(price * weekdayNights)}</span>
                            </div>
                          )}
                          {weekendNights > 0 && (
                            <div className="flex justify-between text-gray-600 font-medium">
                              <span>{formatCurrency(weekendPrice)} × {weekendNights} weekend {weekendNights === 1 ? 'night' : 'nights'}</span>
                              <span>{formatCurrency(weekendPrice * weekendNights)}</span>
                            </div>
                          )}
                          {extraGuestTotal > 0 && (
                            <div className="flex justify-between text-gray-600 font-medium">
                              <span>Extra guest charge ({extraGuests} guests)</span>
                              <span>{formatCurrency(extraGuestTotal)}</span>
                            </div>
                          )}
                          {selectedAddOns.length > 0 && addOns.filter(a => selectedAddOns.includes(a.name)).map(addon => (
                            <div key={addon.name} className="flex justify-between text-gray-600 font-medium">
                              <span>{addon.name}</span>
                              <span>{formatCurrency(addon.price)}</span>
                            </div>
                          ))}
                           {user?.isMember && discountAmount > 0 && (
                            <div className="flex justify-between text-green-600 font-semibold">
                              <span>{((user.membershipType || 'none').charAt(0).toUpperCase() + (user.membershipType || 'none').slice(1))} discount ({discountPercent}%)</span>
                              <span>-{formatCurrency(discountAmount)}</span>
                            </div>
                          )}
                          {cleaningFee > 0 && (
                            <div className="flex justify-between text-gray-650 font-medium">
                              <span>Cleaning fee</span>
                              <span>{formatCurrency(cleaningFee)}</span>
                            </div>
                          )}
                          {serviceFee > 0 && (
                            <div className="flex justify-between text-gray-650 font-medium">
                              <span>Service fee</span>
                              <span>{formatCurrency(serviceFee)}</span>
                            </div>
                          )}
                        </div>

                        {/* Middle: Total & Split Details */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-medium">Total Booking Amount</span>
                          <span className="font-bold text-gray-900 text-sm">{formatCurrency(totalPrice)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs pt-3.5 border-t border-gray-200">
                          <span className="text-gray-900 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Amount Paying Now (50%)
                          </span>
                          <span className="text-sm font-black text-green-600">{formatCurrency(totalPrice * 0.5)}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs pt-3.5 border-t border-gray-200">
                          <span className="text-gray-900 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Amount to Pay at Check-in
                          </span>
                          <span className="text-sm font-black text-amber-600">{formatCurrency((totalPrice - Math.round(totalPrice * 0.5)) + 5000)}</span>
                        </div>

                        {/* Bottom: Nested Check-in Breakdown */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-[10px] text-gray-500 leading-relaxed space-y-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span>Remaining Balance (50%)</span>
                            <span className="font-semibold text-gray-700">{formatCurrency(totalPrice - Math.round(totalPrice * 0.5))}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Security Deposit (Refundable)</span>
                            <span className="font-semibold text-gray-700">{formatCurrency(5000)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox and Terms agreement */}
                    <div className="mt-6 mb-6 flex items-start gap-2.5 text-xs text-gray-600 text-left bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
                      <input
                        id="termsCheckbox"
                        type="checkbox"
                        checked={isTermsAccepted}
                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300 cursor-pointer transition-all accent-gray-900"
                      />
                      <label htmlFor="termsCheckbox" className="leading-relaxed cursor-pointer select-none">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setIsTermsModalOpen(true)}
                          className="font-black underline text-gray-900 hover:text-gray-750 transition"
                        >
                          booking and payment terms
                        </button>
                        .
                      </label>
                    </div>

                    <Button size="lg" fullWidth onClick={handleReserve} disabled={isPending || !isTermsAccepted}>
                      {isPending ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center py-10 animate-in zoom-in-95 fade-in duration-500">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                      <CheckCircle size={40} className="animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-gray-900 tracking-tight">Payment Successful!</h3>
                    <p className="text-gray-500 mb-8 text-sm">Your reservation at <span className="font-bold text-gray-900">{name}</span> is confirmed.</p>
                    
                    {paymentDetails && (
                      <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 text-left space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Advance Paid Upfront</span>
                          <span className="text-lg font-black text-green-600">{formatCurrency(paymentDetails.amount * 0.5)}</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Booking ID:</span>
                            <span className="font-mono text-gray-900 font-bold">{paymentDetails.bookingId.slice(-8).toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Transaction ID:</span>
                            <span className="font-mono text-gray-900 font-medium">{paymentDetails.paymentId}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 pt-2 border-t border-dashed border-gray-200">
                            <span>Total Booking Amount:</span>
                            <span className="text-gray-900 font-semibold">{formatCurrency(paymentDetails.amount)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Due at Check-in (50% + Deposit):</span>
                            <span className="text-amber-600 font-bold">{formatCurrency(paymentDetails.amount * 0.5 + 5000)}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-500 bg-white/70 border border-gray-150 p-3 rounded-xl leading-relaxed space-y-0.5">
                          <div>• Check-in Balance (50%): <span className="font-semibold text-gray-800">{formatCurrency(paymentDetails.amount * 0.5)}</span></div>
                          <div>• Security Deposit (Refundable): <span className="font-semibold text-gray-800">{formatCurrency(5000)}</span></div>
                          <div className="text-[9px] pt-1.5 border-t border-gray-100 text-gray-400">
                            💡 The security deposit will be refunded after check-out, subject to property inspection.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={() => router.push('/profile')} 
                        fullWidth 
                        size="lg"
                        className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/20 text-base font-bold py-6 transition-transform hover:scale-[1.02]"
                      >
                        View Booking Details
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/')} 
                        fullWidth 
                        size="lg"
                        className="border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-base font-bold py-6 transition-all"
                      >
                        Return to Home
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Container>


      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={stayData.name}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        image={galleryImages[0]}
        bedrooms={stayData.bedrooms}
        capacity={stayData.capacity}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        totalPrice={totalPrice}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

// Helper icon mapping
function getAmenityIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes('wifi')) return <Wifi size={24} className="text-gray-700" />;
  if (lower.includes('pool')) return <Droplet size={24} className="text-gray-700" />;
  if (lower.includes('kitchen')) return <Utensils size={24} className="text-gray-700" />;
  if (lower.includes('parking')) return <Car size={24} className="text-gray-700" />;
  if (lower.includes('air conditioning') || lower.includes('ac')) return <Wind size={24} className="text-gray-700" />;
  if (lower.includes('tv')) return <Tv size={24} className="text-gray-700" />;
  if (lower.includes('heating')) return <Flame size={24} className="text-gray-700" />;
  if (lower.includes('gym')) return <Dumbbell size={24} className="text-gray-700" />;
  if (lower.includes('beach')) return <Waves size={24} className="text-gray-700" />;
  if (lower.includes('workspace')) return <Briefcase size={24} className="text-gray-700" />;
  return <CheckCircle size={24} className="text-gray-700" />;
}

const dummyAmenities = [
  { name: 'Fast Wifi', icon: <Wifi size={24} className="text-gray-700" /> },
  { name: 'Private Pool', icon: <Droplet size={24} className="text-gray-700" /> },
  { name: 'Kitchen', icon: <Coffee size={24} className="text-gray-700" /> },
  { name: 'Free Parking', icon: <Car size={24} className="text-gray-700" /> },
  { name: 'Air Conditioning', icon: <Wind size={24} className="text-gray-700" /> },
  { name: 'Heating', icon: <Snowflake size={24} className="text-gray-700" /> },
  { name: 'TV', icon: <Tv size={24} className="text-gray-700" /> },
  { name: 'Washer', icon: <Droplet size={24} className="text-gray-700" /> },
];

function generateMockBookedDates(): string[] {
  const booked: string[] = [];
  const today = new Date();
  for (let i = 5; i <= 45; i++) {
    if (Math.random() > 0.7) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      booked.push(formatLocalYMD(date));
    }
  }
  return booked;
}