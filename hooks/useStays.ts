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
      if (typeof window !== 'undefined') {
        localStorage.setItem('kunnath_cached_stays', JSON.stringify(data));
      }
      return data;
    },
    initialData: () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('kunnath_cached_stays');
        if (cached) {
          try {
            return JSON.parse(cached) as FarmStay[];
          } catch (e) {
            console.error('Error parsing cached stays', e);
          }
        }
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useStayDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['stay', id],
    queryFn: async () => {
      const { data } = await api.get<FarmStay>(`/stays/${id}`);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`kunnath_cached_stay_${id}`, JSON.stringify(data));
      }
      return data;
    },
    enabled: !!id,
    initialData: () => {
      // 1. Try to get from active stays list in query cache
      const stays = queryClient.getQueryData<FarmStay[]>(['stays']);
      const stayFromList = stays?.find(s => s._id === id);
      if (stayFromList) return stayFromList;

      // 2. Fallback to localStorage for stay details
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`kunnath_cached_stay_${id}`);
        if (cached) {
          try {
            return JSON.parse(cached) as FarmStay;
          } catch (e) {
            console.error('Error parsing cached stay detail', e);
          }
        }
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
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
