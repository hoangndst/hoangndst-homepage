import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts } from '@/lib/content'

export function GET() {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const posts = getPublishedPosts()
  const lines = [
    `# ${siteMetadata.title}`,
    '',
    `> ${siteMetadata.description}`,
    '',
    '## Primary pages',
    '',
    `- [Home](${siteUrl}/): Personal site and portfolio`,
    `- [Blog](${siteUrl}/blog): Engineering notes and research`,
    `- [Talks](${siteUrl}/talks): Talks and presentations`,
    `- [Projects](${siteUrl}/projects): Selected projects`,
    `- [About](${siteUrl}/about): About the author`,
    '',
    '## Blog posts',
    '',
    ...posts.map(
      (post) => `- [${post.title}](${siteUrl}/${post.path}): ${post.summary ?? ''}`
    ),
    '',
    '## Machine-readable content',
    '',
    `- [Blog index](${siteUrl}/blog.md)`,
    `- [Raw post format](${siteUrl}/blog/{slug}/raw)`,
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
