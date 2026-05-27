import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/lib/db/models/ContactMessage';
import { checkAdmin } from '@/lib/auth/protect';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id } = await params;
    const message = await ContactMessage.findByIdAndDelete(id);

    if (message) {
      return NextResponse.json({ message: 'Contact message removed' });
    } else {
      return NextResponse.json({ message: 'Contact message not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Admin Delete Contact Message Error:', error);
    return NextResponse.json({ message: 'Error deleting contact message', error: error.message }, { status: 500 });
  }
}
