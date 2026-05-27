import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, Filter, CheckCircle, XCircle, Clock, MoreVertical, ExternalLink } from 'lucide-react';
import { useAdminEventBookings, useUpdateEventBookingStatus } from '../../hooks/useEventBookings';
import { useAdminEvents } from '../../hooks/useEvents';

export const EventBookingManagement = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [eventId, setEventId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: bookingsData, isLoading } = useAdminEventBookings(page, status, eventId, searchTerm);
  const { data: events } = useAdminEvents();
  const updateStatus = useUpdateEventBookingStatus();

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Event Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage reservations and attendee information for your events.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by guest name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 max-w-[200px]"
          >
            <option value="all">All Events</option>
            {events?.map(event => (
              <option key={event._id} value={event._id}>{event.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookingsData?.bookings.map((booking: any) => (
                <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{booking.guestName}</span>
                      <span className="text-xs text-gray-500">{booking.guestEmail}</span>
                      <span className="text-xs text-gray-500">{booking.guestPhone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{booking.eventId?.title}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{booking.eventId?.category}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">
                    {booking.guests} Pax
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ₹{booking.totalPrice?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                      {booking.status === 'confirmed' && <CheckCircle size={12} className="mr-1" />}
                      {booking.status === 'cancelled' && <XCircle size={12} className="mr-1" />}
                      {booking.status === 'pending' && <Clock size={12} className="mr-1" />}
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking._id, 'confirmed')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!bookingsData?.bookings.length && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    No event bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {bookingsData && bookingsData.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing page {bookingsData.currentPage} of {bookingsData.totalPages} ({bookingsData.total} total bookings)
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                disabled={page === bookingsData.totalPages}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
