'use client';

import React from 'react';
import { Card } from '@/Components/ui/Card';
import { Users, Home, Activity, CalendarCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Farm Stays', value: '4', icon: <Home size={24} className="text-blue-500" /> },
    { label: 'Active Bookings', value: '12', icon: <CalendarCheck size={24} className="text-green-500" /> },
    { label: 'Total Members', value: '28', icon: <Users size={24} className="text-purple-500" /> },
    { label: 'Activities Offered', value: '6', icon: <Activity size={24} className="text-orange-500" /> },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-display">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the Kunnath House Admin Control Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center justify-between border-gray-100 shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="text-center py-10 text-gray-500">
            Booking chart placeholder
          </div>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Membership Growth</h2>
          <div className="text-center py-10 text-gray-500">
            Membership chart placeholder
          </div>
        </Card>
      </div>
    </div>
  );
}
