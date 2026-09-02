import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumAmount: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  applicableTo: 'stay' | 'sport';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ['adminCoupons'],
    queryFn: async () => {
      const { data } = await api.get<Coupon[]>('/admin/coupons');
      return data;
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponData: Partial<Coupon>) => {
      const { data } = await api.post<Coupon>('/admin/coupons', couponData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, couponData }: { id: string; couponData: Partial<Coupon> }) => {
      const { data } = await api.put<Coupon>(`/admin/coupons/${id}`, couponData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/coupons/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });
};

export interface ValidateCouponResponse {
  success: boolean;
  couponId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  finalAmount: number;
}

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (params: { code: string; bookingType: 'stay' | 'sport'; bookingAmount: number }) => {
      const { data } = await api.post<ValidateCouponResponse>('/coupon/validate', params);
      return data;
    },
  });
};
