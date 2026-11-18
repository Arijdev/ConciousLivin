import type { Metadata } from 'next';

const SITE_NAME = 'ConciousLivin Health Academy';

export const SITE_URL = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://conciouslivin.in').origin;
  } catch {
    return 'https://conciouslivin.in';
  }
})();

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: PageMetaInput): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: socialTitle } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      url: path,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
    },
    ...(noindex
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          },
        }
      : {}),
  };
}
