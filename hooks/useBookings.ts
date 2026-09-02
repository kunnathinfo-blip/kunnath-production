import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

interface CreateBookingParams {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  termsAccepted?: boolean;
  couponCode?: string;
}

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (bookingData: CreateBookingParams) => {
      const { data } = await api.post('/bookings', bookingData);
      return data;
    },
  });
};

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async (orderData: CreateBookingParams & { selectedAddOns?: string[] }) => {
      const { data } = await api.post('/payments/create-order', orderData);
      return data;
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: { 
      razorpay_order_id: string; 
      razorpay_payment_id: string; 
      razorpay_signature: string; 
      bookingId: string;
    }) => {
      const { data } = await api.post('/payments/verify-payment', paymentData);
      return data;
    },
  });
};


export const useMyBookings = () => {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/mybookings');
      return data;
    },
  });
};

// --- ADMIN HOOKS ---

export interface AdminStayBooking {
  _id: string;
  userId: { _id: string; name: string; email: string };
  stayId: { _id: string; name: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  createdAt: string;
  razorpayPaymentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  upfrontAmountPaid?: number;
  amountDueAtCheckIn?: number;
  securityDeposit?: number;
  securityDepositStatus?: 'pending' | 'refunded' | 'retained';
}

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data } = await api.get<AdminStayBooking[]>('/admin/bookings');
      return data;
    },
    refetchInterval: 15000,
  });
};

export const useUpdateAdminBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/admin/bookings/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadStayBookingCount'] });
    },
  });
};

export const useDeleteAdminBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/bookings/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadStayBookingCount'] });
    },
  });
};

// Admin: unread stay bookings count for notification badge
export const useUnreadStayBookingCount = () => {
  return useQuery({
    queryKey: ['unreadStayBookingCount'],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/admin/bookings/unread-count');
      return data.count;
    },
    refetchInterval: 10000,
  });
};

// Admin: mark all stay bookings as read
export const useMarkStayBookingsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/admin/bookings/mark-read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      queryClient.invalidateQueries({ queryKey: ['unreadStayBookingCount'] });
    },
  });
};
