import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts } from '@/lib/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = getPublishedPosts().map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/projects`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/talks`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/tags`, changeFrequency: 'weekly', priority: 0.5 },
  ]

  return [...routes, ...blogRoutes]
}
