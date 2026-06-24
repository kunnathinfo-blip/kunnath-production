import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';
import Booking from '@/lib/db/models/Booking';
import BlockedDate from '@/lib/db/models/BlockedDate';

const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

function collectImages(baseDir: string, slug: string): string[] {
  const images: string[] = [];
  if (!fs.existsSync(baseDir)) return images;

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && IMAGE_RE.test(entry.name)) {
      images.push(`/stays/${slug}/${entry.name}`);
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(baseDir, entry.name);
      const subFiles = fs.readdirSync(subDir)
        .filter(f => IMAGE_RE.test(f))
        .sort();
      for (const file of subFiles) {
        images.push(`/stays/${slug}/${entry.name}/${file}`);
      }
    }
  }

  return images;
}

function deduplicateImages(images: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const img of images) {
    const filename = path.basename(img);
    if (!seen.has(filename)) {
      seen.add(filename);
      result.push(img);
    }
  }
  return result;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const stay = await FarmStay.findById(id);

    if (!stay) {
      return NextResponse.json({ message: 'Farm stay not found' }, { status: 404 });
    }

    const stayObj = stay.toObject();

    // Calculate unavailable dates from confirmed bookings
    const bookings = await Booking.find({
      stayId: stay._id,
      status: { $ne: 'cancelled' }
    });

    const bookedDates: string[] = [];
    bookings.forEach(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      let current = new Date(start);

      while (current < end) {
        bookedDates.push(current.toLocaleDateString('en-CA'));
        current.setDate(current.getDate() + 1);
      }
    });

    // Calculate blocked dates from admin manual blocks
    const blocks = await BlockedDate.find({ stayId: stay._id });
    const blockedDates: { date: string; reason: string; notes?: string; blockId: string }[] = [];
    const blockedDateStrings: string[] = [];
    blocks.forEach(block => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);
      let current = new Date(start);

      while (current < end) {
        const dateStr = current.toLocaleDateString('en-CA');
        blockedDates.push({
          date: dateStr,
          reason: block.reason,
          notes: block.notes,
          blockId: block._id.toString()
        });
        blockedDateStrings.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
    });

    stayObj.bookedDates = bookedDates;
    stayObj.blockedDates = blockedDates;
    stayObj.unavailableDates = Array.from(new Set([
      ...(stayObj.unavailableDates || []),
      ...bookedDates,
      ...blockedDateStrings
    ])).sort();

    if (stayObj.slug && process.env.NODE_ENV !== 'production') {
      const hasExternalImages = stayObj.images && stayObj.images.length > 0 && stayObj.images[0].startsWith('http');
      if (!hasExternalImages) {
        try {
          const galleryPath = path.join(process.cwd(), 'public/stays', stayObj.slug);
          const folderImages = deduplicateImages(collectImages(galleryPath, stayObj.slug));

          if (folderImages.length > 0) {
            stayObj.images = Array.from(new Set([...folderImages, ...stayObj.images]));
          }
        } catch (fsError: any) {
          console.warn(`Filesystem scan skipped for ${stayObj.slug}: ${fsError.message}`);
        }
      }
    }

    return NextResponse.json(stayObj);
  } catch (error: any) {
    console.error('Fetch Stay Detail Error:', error);
    return NextResponse.json({ message: 'Farm stay not found' }, { status: 404 });
  }
}
