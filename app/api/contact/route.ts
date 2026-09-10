import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/lib/db/models/ContactMessage';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { firstName, lastName, email, phone, subject, message } = await req.json();

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
    }

    const newContactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      subject: subject || 'No Subject',
      message,
    });

    const savedMessage = await newContactMessage.save();
    return NextResponse.json({ success: true, data: savedMessage }, { status: 201 });
  } catch (error: any) {
    console.error('Submit Contact Message Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message', error: error.message }, { status: 500 });
  }
}
