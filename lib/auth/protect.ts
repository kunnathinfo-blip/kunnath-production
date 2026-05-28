import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '../db/connect';
import User from '../db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_kunnath_key_2026';

export async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value;

  if (!token) {
    return null;
  }

  try {
    await connectDB();
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function checkAdmin(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (user && user.role === 'admin') {
    return user;
  }
  return null;
}

export async function setAuthCookie(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
  });

  const cookieStore = await cookies();
  cookieStore.set('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}
