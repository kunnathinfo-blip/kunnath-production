'use client';

import React, { useEffect } from 'react';
import { useAdminBookings, useUpdateAdminBooking, useDeleteAdminBooking, useMarkStayBookingsRead } from '@/hooks/useBookings';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { CheckCircle, XCircle, Trash2, Calendar as CalendarIcon, User, Phone, Mail } from 'lucide-react';

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useAdminBookings();
  const { mutate: updateBooking } = useUpdateAdminBooking();
  const { mutate: deleteBooking } = useDeleteAdminBooking();
  const { mutate: markRead } = useMarkStayBookingsRead();

  // Mark all stay bookings as read when page opens
  useEffect(() => {
    markRead();
  }, [markRead]);

  const handleUpdateStatus = (id: string, status: string) => {
    updateBooking({ id, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this booking?')) {
      deleteBooking(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Confirmed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold font-display text-gray-900">Stay Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage reservations for your farm stays</p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings?.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            <p className="text-sm text-gray-500">You don't have any stay reservations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {bookings?.map((booking) => (
              <Card key={booking._id} className="p-5 flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{booking.stayId?.name || 'Unknown Stay'}</h3>
                      <p className="text-sm text-gray-500">Booked on {formatDate(booking.createdAt)}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        <CalendarIcon size={14} /> Dates
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{booking.guests} Guests</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        <User size={14} /> Guest
                      </div>
                      <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone size={12} /> {booking.guestPhone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Mail size={12} /> {booking.guestEmail}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-150 pt-3 space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-gray-600">Total Stay Price</span>
                      <span className="text-sm font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-gray-600">Paid Upfront (50%)</span>
                      <span className="text-sm font-black text-green-600">
                        ₹{(booking.upfrontAmountPaid ?? Math.round((booking.totalPrice || 0) * 0.5))?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-gray-600">Due at Check-in (50%)</span>
                      <span className="text-sm font-black text-amber-600">
                        ₹{(booking.amountDueAtCheckIn ?? Math.round((booking.totalPrice || 0) * 0.5))?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-gray-600">Security Deposit</span>
                      <span className="text-xs font-bold text-gray-600">
                        ₹{(booking.securityDeposit ?? 5000)?.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">(Refundable)</span>
                      </span>
                    </div>
                  </div>

                  {booking.razorpayPaymentId && (
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</span>
                        <span className="text-xs font-mono text-gray-905 font-medium">{booking.razorpayPaymentId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</span>
                          {booking.paymentStatus === 'completed' ? (
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded border border-green-100">Paid</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-wider rounded border border-yellow-100">Pending</span>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deposit</span>
                          {booking.securityDepositStatus === 'refunded' ? (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded border border-blue-100">Refunded</span>
                          ) : booking.securityDepositStatus === 'retained' ? (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded border border-red-100">Retained</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider rounded border border-amber-100">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                  {booking.status !== 'confirmed' && (
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                    >
                      <CheckCircle size={16} className="mr-2" /> Approve
                    </Button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                    >
                      <XCircle size={16} className="mr-2" /> Cancel
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex-none px-3 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
