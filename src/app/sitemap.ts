import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/guides`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/calculators`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/consultation`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/quiz`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
