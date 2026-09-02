import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Sport } from './useSports';

export interface SportBooking {
  _id: string;
  user: any;
  sport: Sport;
  date: string;
  timeSlots: string[];
  timeSlot?: string; // backward compatibility
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  userDetails: {
    name: string;
    email: string;
    phone: string;
    note?: string;
  };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  expiresAt?: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSportAvailability(sportId: string, date: string) {
  return useQuery({
    queryKey: ['sportAvailability', sportId, date],
    queryFn: async () => {
      if (!sportId || !date) return { bookedSlots: [] };
      const { data } = await api.get<{ bookedSlots: string[] }>(`/sport-bookings/availability/${sportId}/${date}`);
      return data;
    },
    enabled: !!sportId && !!date,
  });
}

export function useCheckStayBooking() {
  return useQuery({
    queryKey: ['checkStayBooking'],
    queryFn: async () => {
      const { data } = await api.get<{ hasStayBooking: boolean }>('/sport-bookings/check-stay');
      return data;
    },
  });
}

export function useCreateSportBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      const { data } = await api.post('/sport-bookings', bookingData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sportAvailability', variables.sport, variables.date] });
      queryClient.invalidateQueries({ queryKey: ['mySportBookings'] });
    },
  });
}

export function useCreateSportPaymentOrder() {
  return useMutation({
    mutationFn: async (orderData: {
      sport: string;
      date: string;
      timeSlots: string[];
      duration: number;
      userDetails: {
        name: string;
        email: string;
        phone: string;
        note?: string;
      };
      couponCode?: string;
    }) => {
      const { data } = await api.post('/payments/create-sport-order', {
        sportId: orderData.sport,
        date: orderData.date,
        timeSlots: orderData.timeSlots,
        duration: orderData.duration,
        userDetails: orderData.userDetails,
        couponCode: orderData.couponCode
      });
      return data;
    },
  });
}

export function useVerifySportPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData: { 
      razorpay_order_id: string; 
      razorpay_payment_id: string; 
      razorpay_signature: string; 
      bookingId: string;
    }) => {
      const { data } = await api.post('/payments/verify-sport-payment', paymentData);
      return data;
    },
    onSuccess: (data) => {
      if (data?.booking) {
        queryClient.invalidateQueries({ queryKey: ['sportAvailability', data.booking.sport, data.booking.date] });
      }
      queryClient.invalidateQueries({ queryKey: ['mySportBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminSportBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadSportBookingCount'] });
    },
  });
}

export function useMySportBookings() {
  return useQuery({
    queryKey: ['mySportBookings'],
    queryFn: async () => {
      const { data } = await api.get<SportBooking[]>('/sport-bookings/my-bookings');
      return data;
    },
  });
}

// Admin: fetch all sport bookings with polling
export const useAdminSportBookings = () => {
  return useQuery({
    queryKey: ['adminSportBookings'],
    queryFn: async () => {
      const { data } = await api.get<SportBooking[]>('/admin/sport-bookings');
      return data;
    },
    refetchInterval: 15000,
  });
};

// Admin: unread sport bookings count for notification badge
export const useUnreadSportBookingCount = () => {
  return useQuery({
    queryKey: ['unreadSportBookingCount'],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/admin/sport-bookings/unread-count');
      return data.count;
    },
    refetchInterval: 10000,
  });
};

// Admin: mark all sport bookings as read
export const useMarkSportBookingsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/admin/sport-bookings/mark-read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSportBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadSportBookingCount'] });
    },
  });
};
