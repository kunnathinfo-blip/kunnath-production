import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface FarmStay {
  _id: string;
  name: string;
  slug: string;
  price: number;
  weekendPrice: number;
  beds: number;
  capacity: number;
  bathrooms: number;
  bedrooms: number;
  halls: number;
  maxGuests: number;
  extraGuestCharge: number;
  securityDeposit: number;
  bookingAdvance: number;
  images: string[];
  featuredImages?: string[];
  categorizedImages?: {
    rooms: string[];
    amenities: string[];
    dining: string[];
    activities: string[];
    exterior: string[];
    interior: string[];
  };
  otherImages?: string[];
  amenities: string[];
  foodOptions: string[];
  addOns: { name: string; price: number }[];
  description: string;
  rating?: number;
  reviews?: number;
  host?: {
    name: string;
    isSuperhost: boolean;
    avatar: string | null;
  };
  amenitiesList?: string[];
  reviewList?: {
    author: string;
    date: string;
    text: string;
  }[];
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  houseRules?: string[];
  safetyItems?: string[];
  cancellationPolicy?: string;
  unavailableDates?: string[];
}

export const useStays = () => {
  return useQuery({
    queryKey: ['stays'],
    queryFn: async () => {
      const { data } = await api.get<FarmStay[]>('/stays');
      return data;
    },
    staleTime: 0,
  });
};

export const useStayDetails = (id: string) => {
  return useQuery({
    queryKey: ['stay', id],
    queryFn: async () => {
      const { data } = await api.get<FarmStay>(`/stays/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreateStay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stayData: Partial<FarmStay>) => {
      const { data } = await api.post<FarmStay>('/admin/stays', stayData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
    },
  });
};

export const useUpdateStay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stayData }: { id: string; stayData: Partial<FarmStay> }) => {
      const { data } = await api.put<FarmStay>(`/admin/stays/${id}`, stayData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['stay', variables.id] });
    },
  });
};

export const useDeleteStay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/stays/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
    },
  });
};

export interface BlockedDateRange {
  _id: string;
  stayId: string;
  startDate: string;
  endDate: string;
  reason: 'Offline Booking' | 'Maintenance' | 'Owner Use' | 'Special Event' | 'Other';
  notes?: string;
  blockedBy: string | { _id: string; name: string };
  createdAt?: string;
  isOverride?: boolean;
  customerName?: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
}

export const useBlockedDates = (stayId: string) => {
  return useQuery({
    queryKey: ['blocked-dates', stayId],
    queryFn: async () => {
      const { data } = await api.get<BlockedDateRange[]>(`/admin/stays/${stayId}/blocked-dates`);
      return data;
    },
    enabled: !!stayId,
  });
};

export const useCreateBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stayId, blockData }: { stayId: string; blockData: { startDate: string; endDate: string; reason: string; notes?: string; override?: boolean; customerName?: string; phoneNumber?: string; aadhaarNumber?: string } }) => {
      const { data } = await api.post(`/admin/stays/${stayId}/blocked-dates`, blockData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates', variables.stayId] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['stay', variables.stayId] });
    },
  });
};

export const useDeleteBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stayId, blockId }: { stayId: string; blockId: string }) => {
      const { data } = await api.delete(`/admin/stays/${stayId}/blocked-dates/${blockId}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates', variables.stayId] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['stay', variables.stayId] });
    },
  });
};

export const useUpdateBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stayId, blockId, blockData }: { stayId: string; blockId: string; blockData: { startDate: string; endDate: string; reason: string; notes?: string; override?: boolean; customerName?: string; phoneNumber?: string; aadhaarNumber?: string } }) => {
      const { data } = await api.put(`/admin/stays/${stayId}/blocked-dates/${blockId}`, blockData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blocked-dates', variables.stayId] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['stay', variables.stayId] });
    },
  });
};
