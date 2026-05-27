import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface EventBookingPayload {
  eventId: string;
  date: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

export const useCreateEventBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: EventBookingPayload) => {
      const { data } = await api.post('/events/book', bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEventBookings'] });
    },
  });
};

export const useAdminEventBookings = (page: number = 1, status: string = 'all', eventId: string = 'all', search: string = '') => {
  return useQuery({
    queryKey: ['adminEventBookings', page, status, eventId, search],
    queryFn: async () => {
      const { data } = await api.get(`/events/bookings/admin?page=${page}&status=${status}&eventId=${eventId}&search=${search}`);
      return data;
    },
    refetchInterval: 5000, // Polling: Refresh list every 5 seconds
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateEventBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/events/bookings/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEventBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadEventBookingCount'] });
    },
  });
};

export const useUnreadEventBookingCount = () => {
  return useQuery({
    queryKey: ['unreadEventBookingCount'],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/events/bookings/unread-count');
      return data.count;
    },
    refetchInterval: 3000, // Polling: Refresh badge every 3 seconds
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
