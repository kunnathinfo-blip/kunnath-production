import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await clearAuthCookie();
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error during logout' }, { status: 500 });
  }
}
