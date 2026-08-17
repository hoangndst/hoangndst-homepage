import 'katex/dist/katex.css'

import type { ComponentProps } from 'react'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import {
  getAdjacentPosts,
  getAuthorsBySlugs,
  getPost,
  getPublishedPosts,
  hasPostLoader,
  postLoaders,
} from '@/lib/content'

export const dynamicParams = true

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}
type LayoutContent = ComponentProps<typeof PostLayout>['content']
type LayoutAuthorDetails = ComponentProps<typeof PostLayout>['authorDetails']

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug)
  const post = getPost(slug)
  if (!post) {
    return
  }

  const authorDetails = getAuthorsBySlugs(post.authors.length > 0 ? post.authors : ['default'])
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const imageList = [`${siteMetadata.siteUrl}/blog/${post.slug}/opengraph-image`]
  const canonicalUrl = `${siteMetadata.siteUrl}/${post.path}`
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
      alt: post.title,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonicalUrl,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
      creator: '@hoangndst',
    },
  }
}

export const generateStaticParams = async () => {
  return getPublishedPosts().map((post) => ({
    slug: decodeURI(post.slug),
  }))
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug)
  const post = getPost(slug)
  const hasLoader = hasPostLoader(slug)

  if (!post || post.draft) {
    return notFound()
  }

  if (!hasLoader) {
    return notFound()
  }

  const { default: Content } = await postLoaders[slug]()
  const { prev, next } = getAdjacentPosts(slug)
  const authorDetails = getAuthorsBySlugs(post.authors.length > 0 ? post.authors : ['default'])
  const image = post.images?.length ? post.images[0] : siteMetadata.socialBanner
  const canonicalUrl = `${siteMetadata.siteUrl}/${post.path}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: image.includes('http') ? image : `${siteMetadata.siteUrl}${image}`,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    keywords: post.tags.join(', '),
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  const Layout = layouts[post.layout || defaultLayout]
  if (!Layout) {
    return notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={post as LayoutContent}
        authorDetails={authorDetails as LayoutAuthorDetails}
        next={next}
        prev={prev}
      >
        <Content />
      </Layout>
    </>
  )
}
