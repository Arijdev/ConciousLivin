import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/payment/',
        '/cart',
        '/checkout',
        '/dashboard/',
        '/doctor/',
        '/auth/',
        '/_next/',
        '/static/',
        '/*.json$',
        '/*.xml$',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ''),
  };
}