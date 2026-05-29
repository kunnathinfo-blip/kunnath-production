import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import firebaseAdmin from '@/lib/firebase/admin';
import { setAuthCookie } from '@/lib/auth/protect';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { phoneNumber, idToken, otp } = await req.json();
    
    let cleanedPhone = phoneNumber ? phoneNumber.replace(/\D/g, '').slice(-10) : '';
    let verifiedPhone = '';

    // Use Firebase token verification
    if (!idToken) {
      return NextResponse.json({ message: 'Authentication token is required' }, { status: 400 });
    }

    if (!firebaseAdmin || !firebaseAdmin.apps.length) {
      return NextResponse.json({ message: 'Firebase Admin SDK was not initialized. Please configure process.env.FIREBASE_SERVICE_ACCOUNT.' }, { status: 500 });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const firebasePhone = decodedToken.phone_number;

    if (!firebasePhone) {
      return NextResponse.json({ message: 'No phone number associated with this authentication token.' }, { status: 400 });
    }

    // Clean Firebase phone (usually starts with +91 or other country code)
    verifiedPhone = firebasePhone.replace(/\D/g, '').slice(-10);

    if (!verifiedPhone || verifiedPhone.length !== 10) {
      return NextResponse.json({ message: 'Invalid phone number verified' }, { status: 400 });
    }

    let user = await User.findOne({ phoneNumber: verifiedPhone });
    let userExists = true;

    if (!user) {
      userExists = false;
      user = await User.create({
        phoneNumber: verifiedPhone,
        isVerified: false,
        role: 'user'
      });
    }

    await setAuthCookie(user._id.toString());

    return NextResponse.json({
      success: true,
      userExists,
      user: {
        _id: user._id,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber,
        role: user.role,
        isMember: user.isMember,
        membershipType: user.membershipType,
        isVerified: user.isVerified
      }
    });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ message: 'Authentication verification failed: ' + (error.message || error) }, { status: 500 });
  }
}
