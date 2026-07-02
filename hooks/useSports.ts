import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Sport {
  _id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
  description: string;
  icon: string;
}

export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const { data } = await api.get<Sport[]>('/sports');
      if (typeof window !== 'undefined') {
        localStorage.setItem('kunnath_cached_sports', JSON.stringify(data));
      }
      return data;
    },
    initialData: () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('kunnath_cached_sports');
        if (cached) {
          try {
            return JSON.parse(cached) as Sport[];
          } catch (e) {
            console.error('Error parsing cached sports', e);
          }
        }
      }
      return undefined;
    },
    staleTime: 0,
  });
}

export function useCreateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sportData: Omit<Sport, '_id'>) => {
      const { data } = await api.post<Sport>('/admin/sports', sportData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
    },
  });
}

export function useUpdateSport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sportData }: { id: string, sportData: Partial<Sport> }) => {
      const { data } = await api.put<Sport>(`/admin/sports/${id}`, sportData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
      queryClient.invalidateQueries({ queryKey: ['sport', variables.id] });
    },
  });
}

export function useSportById(id: string) {
  return useQuery({
    queryKey: ['sport', id],
    queryFn: async () => {
      const { data } = await api.get<Sport>(`/sports/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
