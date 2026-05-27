import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/lib/db/models/ContactMessage';
import { checkAdmin } from '@/lib/auth/protect';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Admin Fetch Contact Messages Error:', error);
    return NextResponse.json({ message: 'Error fetching contact messages', error: error.message }, { status: 500 });
  }
}
