'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useStayDetails, FarmStay } from '@/hooks/useStays';
import { useRouter } from 'next/navigation';
import { Button } from '@/Components/ui/Button';

interface AvailabilityModalProps {
  stay: {
    _id: string;
    name: string;
    price: number;
    weekendPrice?: number;
    images?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

function getTodayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

function getMaxBookingDateLocal(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  return maxDate.toLocaleDateString('en-CA');
}

function formatLocalYMD(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

function localDateFromString(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function AvailabilityModal({ stay, isOpen, onClose }: AvailabilityModalProps) {
  const router = useRouter();
  const stayId = stay?._id || '';
  const { data: stayDetail, isLoading } = useStayDetails(stayId);

  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset dates when stay changes or opens
  useEffect(() => {
    if (isOpen) {
      setCheckIn('');
      setCheckOut('');
      setCurrentMonth(new Date());
    }
  }, [isOpen, stayId]);

  if (!mounted || !isOpen || !stay) return null;

  const bookedDates: string[] = stayDetail?.unavailableDates || [];
  const todayLocal = getTodayLocal();
  const maxBookingDateLocal = getMaxBookingDateLocal();

  const goPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const goNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getMonthDays = (date: Date): (string | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(formatLocalYMD(new Date(year, month, d)));
    }
    while (days.length < 42) days.push(null);
    return days;
  };

  const currentMonthDays = getMonthDays(currentMonth);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = getMonthDays(nextMonthDate);

  const handleDateClick = (ymd: string | null) => {
    if (!ymd) return;
    if (ymd < todayLocal) return;
    if (ymd > maxBookingDateLocal) return;

    if (!checkIn || (checkIn && checkOut)) {
      if (bookedDates.includes(ymd)) return;
      setCheckIn(ymd);
      setCheckOut('');
    } else {
      if (ymd > checkIn) {
        // Range check
        const start = localDateFromString(checkIn);
        const end = localDateFromString(ymd);
        end.setDate(end.getDate() - 1);
        let curr = localDateFromString(checkIn);
        let hasBooked = false;
        while (curr <= end) {
          if (bookedDates.includes(formatLocalYMD(curr))) {
            hasBooked = true;
            break;
          }
          curr.setDate(curr.getDate() + 1);
        }
        if (hasBooked) {
          return;
        }
        setCheckOut(ymd);
      } else if (ymd < checkIn) {
        if (bookedDates.includes(ymd)) return;
        setCheckIn(ymd);
        setCheckOut('');
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
  const isBooked = (ymd: string): boolean => bookedDates.includes(ymd);

  const renderMonth = (monthDate: Date, days: (string | null)[], monthLabel: string) => (
    <div className="flex-1 min-w-[240px]">
      <div className="text-center font-bold text-gray-800 mb-3 text-sm">{monthLabel}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-1.5 uppercase">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d}>{d}</div>
        ))}
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
          const isAfterMaxDate = ymd > maxBookingDateLocal;

          let disabled = false;
          if (past || isAfterMaxDate) {
            disabled = true;
          } else if (!checkIn || (checkIn && checkOut)) {
            if (booked) disabled = true;
          } else {
            if (ymd < checkIn) {
              if (booked) disabled = true;
            } else if (ymd > checkIn) {
              const s = localDateFromString(checkIn);
              const e = localDateFromString(ymd);
              e.setDate(e.getDate() - 1);
              let curr = localDateFromString(checkIn);
              let rangeBooked = false;
              while (curr <= e) {
                if (bookedDates.includes(formatLocalYMD(curr))) {
                  rangeBooked = true;
                  break;
                }
                curr.setDate(curr.getDate() + 1);
              }
              if (rangeBooked) disabled = true;
            }
          }

          let bgClass = '';
          let textClass = 'text-gray-900';
          let roundedClass = 'rounded-full';

          if (disabled) {
            bgClass = booked ? 'bg-red-50' : 'bg-gray-50';
            textClass = booked ? 'text-red-400 line-through' : 'text-gray-300 line-through';
          } else if (selected) {
            bgClass = 'bg-[#1A1A1A] text-white';
            textClass = 'text-white font-bold';
          } else if (inRange) {
            bgClass = 'bg-primary/10';
            textClass = 'text-primary font-semibold';
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
                "h-8 w-8 mx-auto flex items-center justify-center text-xs transition-all",
                roundedClass,
                bgClass,
                textClass,
                disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-100 hover:scale-105 active:scale-95'
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

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = localDateFromString(checkIn);
    const end = localDateFromString(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const nights = calculateNights();

  const handleProceedToBook = () => {
    let url = `/stays/${stayId}`;
    if (checkIn && checkOut) {
      url += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    onClose();
    router.push(url);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-gray-900 font-display">
                {stay.name} Farm Stay Availability
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select your check-in and checkout dates to see availability
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Dates Display */}
        <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Check-in</span>
              <span className="text-sm font-bold text-gray-900">
                {checkIn ? new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Add date'}
              </span>
            </div>
            <span className="text-gray-400 px-2">→</span>
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Checkout</span>
              <span className="text-sm font-bold text-gray-900">
                {checkOut ? new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Add date'}
              </span>
            </div>
            {checkIn && (
              <button
                onClick={() => { setCheckIn(''); setCheckOut(''); }}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Clear dates"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="text-right">
            {nights > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                <CheckCircle2 size={14} /> {nights} {nights === 1 ? 'Night' : 'Nights'} Selected
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-medium">
                Tap dates to select stay
              </span>
            )}
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-xs text-gray-500 mt-3 font-medium">Checking live stay availability...</p>
            </div>
          ) : (
            <div>
              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goPrevMonth}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span> Booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] inline-block"></span> Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Available
                  </span>
                </div>
                <button
                  onClick={goNextMonth}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Month Calendar Grid (Single month on mobile, 2 months on desktop) */}
              <div className="flex flex-col sm:flex-row gap-6 justify-between">
                {renderMonth(currentMonth, currentMonthDays, currentMonthLabel)}
                <div className="hidden sm:block flex-1">
                  {renderMonth(nextMonthDate, nextMonthDays, nextMonthLabel)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting From</span>
            <span className="text-base font-extrabold text-gray-900">
              {formatCurrency(stay.price)}
              <span className="text-xs font-normal text-gray-500"> / night</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-4 text-sm"
            >
              Close
            </Button>
            <Button
              onClick={handleProceedToBook}
              className="rounded-xl px-5 text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-md"
            >
              {checkIn && checkOut ? 'Book Selected Dates' : 'View Full Stay'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
