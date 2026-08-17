import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  canonicalUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  canonicalUrl,
  ...rest
}: PageSEOProps): Metadata {
  const resolvedDescription = description || siteMetadata.description
  const socialImage = image || siteMetadata.socialBanner

  return {
    title,
    description: resolvedDescription,
    keywords: siteMetadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName: siteMetadata.title,
      images: [socialImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: resolvedDescription,
      card: 'summary_large_image',
      images: [socialImage],
      creator: '@hoangndst',
    },
    ...rest,
  }
}
