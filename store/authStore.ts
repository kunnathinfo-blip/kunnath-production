import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isVerified?: boolean;
  isMember?: boolean;
  membershipType?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp?: string, idToken?: string) => Promise<{ userExists: boolean; user: User }>;
  onboard: (name: string, aadhaarNumber: string) => Promise<void>;
  updateProfile: (profileData: { name?: string; email?: string; aadhaarNumber?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start as true to prevent premature redirects before hydration
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', userData);
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
    } catch (error: any) {
      console.error('Logout failed', error);
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      set({ user: null, isLoading: false });
      // Don't set error state here as this runs on every page load for unauthenticated users
    }
  },

  sendOtp: async (phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/send-otp', { phoneNumber });
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to send OTP',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyOtp: async (phoneNumber, otp, idToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/verify-otp', { phoneNumber, otp, idToken });
      const { userExists, user } = response.data;
      set({ user, isLoading: false });
      return { userExists, user };
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'OTP verification failed',
        isLoading: false,
      });
      throw error;
    }
  },

  onboard: async (name, aadhaarNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/onboard', { name, aadhaarNumber });
      set({ user: response.data.user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Onboarding failed',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ error: null });
    try {
      const response = await api.put('/auth/profile', profileData);
      set({ user: response.data.user });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
      });
      throw error;
    }
  },
}));
