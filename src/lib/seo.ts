import type { Metadata } from 'next';

const SITE_NAME = 'Conscious Living Health Academy';
const SITE_NAME_ALT = 'ConciousLivin Health Academy';

export const SITE_URL = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://consciousliving.in').origin;
  } catch {
    return 'https://consciousliving.in';
  }
})();

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
  ogImage?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
  ogImage = '/og-image.png',
  type = 'website',
  keywords = [],
}: PageMetaInput): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;
  const fullUrl = `${SITE_URL}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : { template: '%s | ' + SITE_NAME, default: title },
    description,
    keywords: keywords?.join(', '),
    alternates: { canonical: fullUrl },
    openGraph: {
      type,
      url: fullUrl,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export function guideMetadata({
  title,
  description,
  slug,
  isFree,
  pages,
  readingTime,
  coverImage,
}: {
  title: string;
  description: string;
  slug: string;
  isFree: boolean;
  pages: number;
  readingTime: string;
  coverImage: string;
}): Metadata {
  const path = `/guides/${slug}`;
  return {
    ...pageMetadata({
      title: `${title} ${isFree ? '| Free Guide' : '| Premium Guide'}`,
      description,
      path,
      ogImage: coverImage,
    }),
    robots: { index: true, follow: true },
    other: {
      'article:published_time': new Date().toISOString(),
      'article:modified_time': new Date().toISOString(),
      'article:section': 'Health Guides',
      'article:tag': 'Health,Clinical Nutrition,Conscious Living',
    },
  };
}

export function articleMetadata({
  title,
  description,
  slug,
  author = 'Dr. Arif Chowdhury',
  publishedAt,
  modifiedAt,
  coverImage,
}: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishedAt: string;
  modifiedAt?: string;
  coverImage: string;
}): Metadata {
  const path = `/articles/${slug}`;
  return {
    ...pageMetadata({
      title,
      description,
      path,
      type: 'article',
      ogImage: coverImage,
    }),
    robots: { index: true, follow: true },
    other: {
      'article:author': author,
      'article:published_time': publishedAt,
      'article:modified_time': modifiedAt || publishedAt,
      'article:section': 'Health Articles',
      'article:tag': 'Health,Conscious Living,Clinical Nutrition,Wellness',
    },
  };
}