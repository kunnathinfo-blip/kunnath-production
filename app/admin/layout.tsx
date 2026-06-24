import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import AdminLayoutClient from '@/Components/admin/AdminLayoutClient';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_kunnath_key_2026';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    await connectDB();
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      redirect('/');
    }
  } catch (error) {
    console.error('Admin layout auth verification error:', error);
    redirect('/login');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
