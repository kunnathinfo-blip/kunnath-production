'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SportBooking, useMarkSportBookingsRead } from '@/hooks/useSportBookings';

export default function AdminSportBookingsPage() {
  const queryClient = useQueryClient();
  const { mutate: markRead } = useMarkSportBookingsRead();

  // Mark all sport bookings as read when page opens
  useEffect(() => {
    markRead();
  }, [markRead]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['adminSportBookings'],
    queryFn: async () => {
      const { data } = await api.get<SportBooking[]>('/admin/sport-bookings');
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/admin/sport-bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSportBookings'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/sport-bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSportBookings'] });
    }
  });

  // Helper to display time range from booking
  const getTimeDisplay = (booking: SportBooking) => {
    // New multi-slot format
    if (booking.timeSlots && booking.timeSlots.length > 0) {
      const startTime = booking.timeSlots[0];
      const lastSlotHour = parseInt(booking.timeSlots[booking.timeSlots.length - 1].split(':')[0]);
      const endTime = `${(lastSlotHour + 1).toString().padStart(2, '0')}:00`;
      return `${startTime} – ${endTime}`;
    }
    // Backward compatibility: old single slot
    if (booking.timeSlot) {
      const hr = parseInt(booking.timeSlot.split(':')[0]);
      return `${booking.timeSlot} – ${(hr + 1).toString().padStart(2, '0')}:00`;
    }
    return 'N/A';
  };

  const getDurationDisplay = (booking: SportBooking) => {
    if (booking.duration) return `${booking.duration}hr`;
    if (booking.timeSlots && booking.timeSlots.length > 0) return `${booking.timeSlots.length}hr`;
    return '1hr';
  };

  if (isLoading) return <div className="py-12 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">Manage Sport Bookings</h1>
        <p className="text-gray-500">View and manage all customer sports reservations</p>
      </div>

      {/* Mobile view (List Cards) */}
      <div className="space-y-4 md:hidden">
        {bookings?.map((booking) => (
          <Card key={booking._id} className="p-4 space-y-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900">{booking.userDetails?.name || booking.user?.name}</h4>
                <p className="text-xs text-gray-505">{booking.userDetails?.email || booking.user?.email}</p>
                <p className="text-xs text-gray-505">{booking.userDetails?.phone}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Sport:</span>
                <span className="font-bold text-gray-900">{booking.sport?.name || 'Deleted Sport'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time:</span>
                <span className="font-medium text-gray-900">{booking.date} ({getTimeDisplay(booking)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">
                  <Clock size={10} />
                  {getDurationDisplay(booking)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                {booking.razorpayPaymentId ? (
                  <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded border border-green-100">Paid (ID: {booking.razorpayPaymentId})</span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${
                    booking.paymentStatus === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                    booking.paymentStatus === 'failed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                  }`}>
                    {booking.paymentStatus || 'Pending'}
                  </span>
                )}
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold">
                <span className="text-gray-900">Price:</span>
                <span className="text-gray-900">₹{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {booking.status !== 'confirmed' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'confirmed' })}
                >
                  <CheckCircle size={14} className="mr-1.5" /> Confirm
                </Button>
              )}
              {booking.status !== 'cancelled' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                  onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'cancelled' })}
                >
                  <XCircle size={14} className="mr-1.5" /> Cancel
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-none text-red-600 hover:text-red-750 hover:bg-red-55 hover:border-red-200"
                onClick={() => {
                  if(window.confirm('Delete this booking permanently?')) {
                    deleteMutation.mutate(booking._id);
                  }
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
        {bookings?.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-150">
            No bookings found.
          </div>
        )}
      </div>

      {/* Table (Desktop View) */}
      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Sport</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Payment Status</th>
                <th className="p-4 font-semibold">Booking Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{booking.userDetails?.name || booking.user?.name}</div>
                    <div className="text-xs">{booking.userDetails?.email || booking.user?.email}</div>
                    <div className="text-xs">{booking.userDetails?.phone}</div>
                  </td>
                  <td className="p-4 font-medium">{booking.sport?.name || 'Deleted Sport'}</td>
                  <td className="p-4">
                    <div className="font-medium">{booking.date}</div>
                    <div className="text-xs text-gray-500">{getTimeDisplay(booking)}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                      <Clock size={12} />
                      {getDurationDisplay(booking)}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</td>
                  <td className="p-4">
                    {booking.razorpayPaymentId ? (
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded border border-green-100 w-max">Paid</span>
                        <span className="text-[10px] font-mono text-gray-500">ID: {booking.razorpayPaymentId}</span>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${
                        booking.paymentStatus === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                        booking.paymentStatus === 'failed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                        {booking.paymentStatus || 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {booking.status !== 'confirmed' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'confirmed' })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark Confirmed"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'cancelled' })}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Mark Cancelled"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if(window.confirm('Delete this booking permanently?')) {
                            deleteMutation.mutate(booking._id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings?.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
