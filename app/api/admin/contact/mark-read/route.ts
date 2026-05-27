import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/lib/db/models/ContactMessage';
import { checkAdmin } from '@/lib/auth/protect';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    await ContactMessage.updateMany({ isRead: false }, { $set: { isRead: true, status: 'read' } });
    return NextResponse.json({ message: 'All messages marked as read' });
  } catch (error: any) {
    console.error('Admin Mark Contact Messages Read Error:', error);
    return NextResponse.json({ message: 'Error marking messages as read', error: error.message }, { status: 500 });
  }
}
