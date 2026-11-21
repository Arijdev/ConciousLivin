import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { HEALTH_ARTICLES } from '@/data/healthData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const lastModified = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/consultation`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Guide pages
  const guidePages = HEALTH_RESOURCES.map((resource) => ({
    url: `${baseUrl}/guides/${resource.id}`,
    lastModified: resource.publishedAt ? new Date(resource.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: resource.isFree ? 0.8 : 0.7,
  }));

  // Article pages
  const articlePages = HEALTH_ARTICLES.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: new Date(article.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Legal pages
  const legalPages = [
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
    { url: `${baseUrl}/refund`, priority: 0.3 },
  ].map((page) => ({
    url: page.url,
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: page.priority,
  }));

  return [...staticPages, ...guidePages, ...articlePages, ...legalPages];
}