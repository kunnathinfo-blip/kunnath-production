'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useMyBookings } from '@/hooks/useBookings';
import { useMySportBookings } from '@/hooks/useSportBookings';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();
  
  // Fetch bookings
  const { data: stayBookings, isLoading: isStaysLoading, isError: isStaysError } = useMyBookings();
  const { data: sportBookings, isLoading: isSportsLoading, isError: isSportsError } = useMySportBookings();

  useEffect(() => {
    // Basic route protection
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return <div className="py-20 text-center text-gray-500">Authenticating...</div>;
  }

  if (!user) return null;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <Container>
        {/* Header / Membership Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Manage your farm stay bookings and sports reservations.</p>
          </div>
          <div className="mt-6 md:mt-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Membership</span>
              {user.isMember ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary capitalize">
                  {user.membershipType} Tier
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                  Standard User
                </span>
              )}
            </div>
            {(!user.isMember || user.membershipType !== 'premium') && (
              <Link href="/membership">
                <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Section 1: Farm Stay Bookings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Stay Bookings</h2>
          {isStaysLoading && <div className="py-8 text-center text-gray-500">Loading stays...</div>}
          {isStaysError && <div className="py-8 text-center text-red-500">Failed to load stays.</div>}
          
          {!isStaysLoading && !isStaysError && stayBookings?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 mb-4">No farm stay reservations yet.</p>
              <Link href="/stays"><Button>Explore Stays</Button></Link>
            </div>
          )}

          <div className="space-y-6">
            {stayBookings?.map((booking: any) => (
              <Card key={booking._id} className="flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <img 
                    src={booking.stayId?.images?.[0] || 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80'} 
                    alt="Stay" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:w-3/4 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{booking.stayId?.name || 'Kunnath Farm Stay'}</h3>
                      <p className="text-sm text-gray-500 mb-4">Booking ID: {booking._id}</p>
                    </div>
                    <div className="text-left md:text-right space-y-1.5 bg-gray-50 p-4 rounded-2xl border border-gray-100/60 min-w-[200px]">
                      <div className="flex justify-between md:justify-end gap-6 items-baseline">
                        <span className="text-xs text-gray-500">Total Price:</span>
                        <span className="text-sm font-semibold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between md:justify-end gap-6 items-baseline">
                        <span className="text-xs text-gray-500">Paid Upfront (50%):</span>
                        <span className="text-base font-bold text-green-600">
                          ₹{(booking.upfrontAmountPaid ?? Math.round((booking.totalPrice || 0) * 0.5))?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between md:justify-end gap-6 items-baseline border-t border-dashed border-gray-200 pt-1.5">
                        <span className="text-xs text-gray-500">Due at Check-in (50%):</span>
                        <span className="text-sm font-bold text-amber-600">
                          ₹{(booking.amountDueAtCheckIn ?? Math.round((booking.totalPrice || 0) * 0.5))?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between md:justify-end gap-6 items-baseline">
                        <span className="text-xs text-gray-500">Security Deposit:</span>
                        <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                          ₹{(booking.securityDeposit ?? 5000)?.toLocaleString()}
                          {booking.securityDepositStatus === 'refunded' ? (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase rounded border border-blue-100">Refunded</span>
                          ) : booking.securityDepositStatus === 'retained' ? (
                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold uppercase rounded border border-red-100">Retained</span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-amber-50/70 text-amber-700 text-[9px] font-bold uppercase rounded border border-amber-100">Pending Check-in</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Check-in</span>
                      <span className="font-medium text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Check-out</span>
                      <span className="font-medium text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Guests</span>
                      <span className="font-medium text-gray-900">{booking.guests}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 2: Sport Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sports & Activities</h2>
          {isSportsLoading && <div className="py-8 text-center text-gray-500">Loading sports...</div>}
          {isSportsError && <div className="py-8 text-center text-red-500">Failed to load sport bookings.</div>}

          {!isSportsLoading && !isSportsError && sportBookings?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 mb-4">No sport reservations yet.</p>
              <Link href="/sports"><Button>Explore Sports</Button></Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sportBookings?.map((booking: any) => (
              <Card key={booking._id} className="p-6 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                  <img 
                    src={booking.sport?.image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80'} 
                    alt="Sport" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-white/90 p-1 rounded text-lg">
                    {booking.sport?.icon || '🏅'}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{booking.sport?.name || 'Deleted Sport'}</h3>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Time:</strong> {(() => {
                        if (booking.timeSlots && booking.timeSlots.length > 0) {
                          const startTime = booking.timeSlots[0];
                          const lastHour = parseInt(booking.timeSlots[booking.timeSlots.length - 1].split(':')[0]);
                          const endTime = `${(lastHour + 1).toString().padStart(2, '0')}:00`;
                          return `${startTime} – ${endTime} (${booking.timeSlots.length}hr)`;
                        }
                        return booking.timeSlot || 'N/A';
                      })()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <div className="flex flex-col">
                      {booking.razorpayPaymentId && (
                        <span className="text-[10px] font-mono text-gray-400">TXN: {booking.razorpayPaymentId}</span>
                      )}
                      {booking.paymentStatus === 'completed' ? (
                        <span className="text-[10px] font-bold text-green-600 uppercase">Paid</span>
                      ) : booking.paymentStatus === 'failed' ? (
                        <span className="text-[10px] font-bold text-red-600 uppercase">Failed</span>
                      ) : null}
                    </div>
                    <span className="font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
}
