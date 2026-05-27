import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';

const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

function collectImages(baseDir: string, slug: string): string[] {
  const images: string[] = [];
  if (!fs.existsSync(baseDir)) return images;

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  // Root-level images first
  for (const entry of entries) {
    if (entry.isFile() && IMAGE_RE.test(entry.name)) {
      images.push(`/stays/${slug}/${entry.name}`);
    }
  }

  // Then images from subdirectories (category folders)
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const stays = await FarmStay.find({ isDeleted: { $ne: true } });

    const staysWithImages = stays.map(stay => {
      const stayObj = stay.toObject();
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
      return stayObj;
    });

    return NextResponse.json(staysWithImages);
  } catch (error: any) {
    console.error('Fetch Stays Error:', error);
    return NextResponse.json({ message: error.message || 'Server Error fetching stays' }, { status: 500 });
  }
}
