import { readFileSync } from 'node:fs'
import path from 'node:path'
import siteMetadata from '@/data/siteMetadata'
import { getAuthorsBySlugs, getPublishedPosts } from '@/lib/content'

export function GET() {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const posts = getPublishedPosts()
  const content = posts
    .map((post) => {
      const source = readFileSync(path.join(process.cwd(), 'src', 'data', post.filePath), 'utf8')
      const authors = getAuthorsBySlugs(post.authors)
        .map((author) => author.name)
        .join(', ')

      return [
        `# ${post.title}`,
        '',
        `- URL: ${siteUrl}/${post.path}`,
        `- Published: ${post.date}`,
        `- Updated: ${post.lastmod ?? post.date}`,
        `- Author: ${authors || siteMetadata.author}`,
        `- Tags: ${post.tags.join(', ')}`,
        '',
        source,
      ].join('\n')
    })
    .join('\n\n---\n\n')

  return new Response(
    [
      `# ${siteMetadata.title} Blog`,
      '',
      'Machine-readable index of engineering notes and research.',
      '',
      content,
    ].join('\n'),
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    }
  )
}
