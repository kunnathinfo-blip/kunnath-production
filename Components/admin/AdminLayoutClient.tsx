'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, Activity, Users, Calendar, Bell, PartyPopper, Menu, X, Tag } from 'lucide-react';
import { useUnreadContactCount } from '@/hooks/useContact';
import { useUnreadStayBookingCount } from '@/hooks/useBookings';
import { useUnreadSportBookingCount } from '@/hooks/useSportBookings';
import { useUnreadEventBookingCount } from '@/hooks/useEventBookings';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: unreadContactCount } = useUnreadContactCount();
  const { data: unreadStayCount } = useUnreadStayBookingCount();
  const { data: unreadSportCount } = useUnreadSportBookingCount();
  const { data: unreadEventCount } = useUnreadEventBookingCount();

  // Close sidebar on navigation change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
    { name: 'Manage Coupons', href: '/admin/coupons', icon: <Tag size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 h-full flex flex-col z-50 transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display">Admin Panel</h2>
            <p className="text-sm text-gray-500">Kunnath Management</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 md:hidden transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${pathname === item.href
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

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 md:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 focus:outline-none transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display leading-tight">Admin Panel</h2>
              <p className="text-xs text-gray-500">Kunnath Management</p>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
