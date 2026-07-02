export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';
import { normalizeStayImages } from '@/lib/utils';

const KNOWN_CATEGORIES = ['rooms', 'amenities', 'dining', 'activities', 'exterior', 'interior', 'other'];
const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    try {
      await connectDB();
      const stay = await FarmStay.findOne({ slug, isDeleted: { $ne: true } });
      if (stay) {
        const normalized = normalizeStayImages(stay);
        return NextResponse.json({
          flat: normalized.images || [],
          categorized: {
            ...normalized.categorizedImages,
            other: normalized.otherImages || []
          }
        });
      }
    } catch (dbError) {
      console.warn('Failed to fetch gallery from database, falling back to local files:', dbError);
    }

    const galleryPath = path.join(process.cwd(), 'public', 'stays', slug);
    if (!fs.existsSync(galleryPath)) {
      return NextResponse.json({ flat: [], categorized: {} });
    }

    const entries = fs.readdirSync(galleryPath, { withFileTypes: true });

    // ── Flat list: root-level images (backward compat for landing/detail pages) ──
    const rootImages = entries
      .filter(e => e.isFile() && IMAGE_RE.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(e => `/stays/${slug}/${e.name}`);

    // ── Categorized: scan known subdirectories ──
    const categorized: Record<string, string[]> = {};
    for (const cat of KNOWN_CATEGORIES) {
      const catDir = path.join(galleryPath, cat);
      if (fs.existsSync(catDir) && fs.statSync(catDir).isDirectory()) {
        const catFiles = fs.readdirSync(catDir)
          .filter(f => IMAGE_RE.test(f))
          .sort((a, b) => a.localeCompare(b));
        if (catFiles.length > 0) {
          categorized[cat] = catFiles.map(f => `/stays/${slug}/${cat}/${f}`);
        }
      }
    }

    // Build a combined flat list: categorized images + root images (deduplicated)
    const allCategorized = Object.values(categorized).flat();
    const flat = allCategorized.length > 0
      ? [...allCategorized, ...rootImages.filter(img => !allCategorized.includes(img))]
      : rootImages;

    return NextResponse.json({ flat, categorized });
  } catch (error) {
    console.error('Error reading gallery folder:', error);
    return NextResponse.json({ flat: [], categorized: {} }, { status: 500 });
  }
}
