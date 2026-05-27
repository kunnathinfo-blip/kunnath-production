'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { LayoutDashboard, Home, Activity, Users, Calendar, Bell, PartyPopper } from 'lucide-react';
import { useUnreadContactCount } from '@/hooks/useContact';
import { useUnreadStayBookingCount } from '@/hooks/useBookings';
import { useUnreadSportBookingCount } from '@/hooks/useSportBookings';
import { useUnreadEventBookingCount } from '@/hooks/useEventBookings';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { data: unreadContactCount } = useUnreadContactCount();
  const { data: unreadStayCount } = useUnreadStayBookingCount();
  const { data: unreadSportCount } = useUnreadSportBookingCount();
  const { data: unreadEventCount } = useUnreadEventBookingCount();

  useEffect(() => {
    // Protect admin routes: only redirect if loading has finished
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50"><span className="text-gray-500">Loading admin panel...</span></div>;
  }

  if (!user || user.role !== 'admin') {
    return null; // Prevent flash of content
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Stays', href: '/admin/stays', icon: <Home size={20} /> },
    { name: 'Stay Bookings', href: '/admin/bookings', icon: <Calendar size={20} />, badge: unreadStayCount },
    { name: 'Events', href: '/admin/events', icon: <PartyPopper size={20} /> },
    { name: 'Event Bookings', href: '/admin/event-bookings', icon: <Calendar size={20} />, badge: unreadEventCount },
    { name: 'Sports', href: '/admin/sports', icon: <Activity size={20} /> },
    { name: 'Sport Bookings', href: '/admin/sport-bookings', icon: <Calendar size={20} />, badge: unreadSportCount },
    { name: 'Enquiries', href: '/admin/contact', icon: <Bell size={20} />, badge: unreadContactCount },
    { name: 'Memberships', href: '/admin/memberships', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 font-display">Admin Panel</h2>
          <p className="text-sm text-gray-500">Kunnath Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={pathname === item.href ? 'text-primary' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge != null && item.badge > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1.5 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
