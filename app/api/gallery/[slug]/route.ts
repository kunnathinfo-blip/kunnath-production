import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const KNOWN_CATEGORIES = ['exterior', 'living', 'bedroom', 'bathroom', 'kitchen', 'amenities'];
const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    // Try to fetch from backend database first to support Cloudinary links
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_BASE_URL}/api/stays`);
      if (res.ok) {
        const stays = await res.json();
        const stay = stays.find((s: any) => s.slug === slug);
        if (stay && stay.images && stay.images.length > 0 && stay.images[0].startsWith('http')) {
          return NextResponse.json({
            flat: stay.images,
            categorized: stay.gallery || {}
          });
        }
      }
    } catch (apiError) {
      console.warn('Failed to fetch gallery from backend API, falling back to local files:', apiError);
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
