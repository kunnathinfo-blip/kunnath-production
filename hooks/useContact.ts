import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  isRead: boolean;
  createdAt: string;
}

// Admin: get all contact messages
export const useAdminContacts = () => {
  return useQuery({
    queryKey: ['adminContacts'],
    queryFn: async () => {
      const { data } = await api.get<ContactMessage[]>('/admin/contact');
      return data;
    },
  });
};

// Admin: get unread count for notification badge
export const useUnreadContactCount = () => {
  return useQuery({
    queryKey: ['unreadContactCount'],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/admin/contact/unread-count');
      return data.count;
    },
    refetchInterval: 30000, // Poll every 30 seconds for new messages
  });
};

// Admin: mark all as read
export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/admin/contact/mark-read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadContactCount'] });
    },
  });
};

// Admin: delete a contact message
export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/contact/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContacts'] });
      queryClient.invalidateQueries({ queryKey: ['unreadContactCount'] });
    },
  });
};
