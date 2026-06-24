import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import BlockedDate from '@/lib/db/models/BlockedDate';
import { checkAdmin } from '@/lib/auth/protect';

// DELETE: Remove a blocked date range
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  try {
    await connectDB();
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const { id: stayId, blockId } = await params;

    const block = await BlockedDate.findOneAndDelete({ _id: blockId, stayId });

    if (!block) {
      return NextResponse.json({ message: 'Blocked date entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Dates unblocked successfully' });
  } catch (error: any) {
    console.error('Delete Blocked Date Error:', error);
    return NextResponse.json({ message: 'Error unblocking dates', error: error.message }, { status: 500 });
  }
}
