import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Event {
  _id: string;
  title: string;
  slug: string;
  category: 'Traditional' | 'Corporate' | 'Upcoming';
  shortDescription: string;
  description: string;
  price: number;
  date: string;
  isFlexibleDate: boolean;
  images: string[];
  capacity?: number;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  total: number;
}

// Fetch paginated events for the frontend
export const useInfiniteEvents = (category: string = 'All', search: string = '') => {
  return useInfiniteQuery<EventsResponse, Error>({
    queryKey: ['events', category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<EventsResponse>(`/events?page=${pageParam}&limit=9&category=${category}&search=${search}`);
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Fetch a single event by slug
export const useEvent = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data } = await api.get<Event>(`/events/slug/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

// --- ADMIN HOOKS ---

export const useAdminEvents = () => {
  return useQuery({
    queryKey: ['adminEvents'],
    queryFn: async () => {
      const { data } = await api.get<Event[]>('/events/admin/all');
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      const { data } = await api.post<Event>('/events', eventData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const { data: responseData } = await api.put<Event>(`/events/${id}`, data);
      return responseData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.slug] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/events/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
