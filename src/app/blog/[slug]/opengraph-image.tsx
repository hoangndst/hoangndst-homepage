import { ImageResponse } from 'next/og'
import { getPost, getPublishedPosts } from '@/lib/content'
import { BlogOgImage, postToOgImageProps } from '@/lib/og/BlogOgImage'

export const alt = 'Blog post by Hoang Nguyen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(decodeURI(slug))

  return new ImageResponse(
    <BlogOgImage
      {...(post
        ? postToOgImageProps(post)
        : { title: 'Notes from building things.', section: 'Blog' })}
    />,
    size
  )
}
