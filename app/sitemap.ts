import { MetadataRoute } from 'next';
import connectDB from '@/lib/db/connect';
import FarmStay from '@/lib/db/models/FarmStay';
import Event from '@/lib/db/models/Event';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kunnathhomes.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stays`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/membership`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/house-rules`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const [stays, events] = await Promise.all([
      FarmStay.find({}, '_id updatedAt').lean(),
      Event.find({ isActive: true }, 'slug updatedAt').lean(),
    ]);

    const stayRoutes: MetadataRoute.Sitemap = (stays || []).map((stay: any) => ({
      url: `${baseUrl}/stays/${stay._id}`,
      lastModified: stay.updatedAt ? new Date(stay.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const eventRoutes: MetadataRoute.Sitemap = (events || []).map((ev: any) => ({
      url: `${baseUrl}/events/${ev.slug}`,
      lastModified: ev.updatedAt ? new Date(ev.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    dynamicRoutes = [...stayRoutes, ...eventRoutes];
  } catch (err) {
    console.error('Error generating dynamic sitemap routes:', err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
