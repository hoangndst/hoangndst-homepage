type RssPost = {
  slug: string
  title: string
  summary?: string
  date: string
  tags?: string[]
}

type BuildRssXmlOptions = {
  title: string
  description: string
  siteUrl: string
  feedPath: string
  language: string
  email: string
  author: string
  posts: RssPost[]
}

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const postItemXml = (siteUrl: string, post: RssPost) => {
  const link = `${siteUrl}/blog/${post.slug}`
  const categories = (post.tags ?? [])
    .map((tag) => `<category>${escapeXml(tag)}</category>`)
    .join('')

  return `<item>
    <guid>${link}</guid>
    <title>${escapeXml(post.title)}</title>
    <link>${link}</link>
    ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    ${categories}
  </item>`
}

export const buildRssXml = (options: BuildRssXmlOptions) => {
  const latestDate =
    options.posts.length > 0 ? new Date(options.posts[0].date).toUTCString() : undefined

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${options.siteUrl}/blog</link>
    <description>${escapeXml(options.description)}</description>
    <language>${options.language}</language>
    <managingEditor>${options.email} (${escapeXml(options.author)})</managingEditor>
    <webMaster>${options.email} (${escapeXml(options.author)})</webMaster>
    ${latestDate ? `<lastBuildDate>${latestDate}</lastBuildDate>` : ''}
    <atom:link href="${options.siteUrl}${options.feedPath}" rel="self" type="application/rss+xml"/>
    ${options.posts.map((post) => postItemXml(options.siteUrl, post)).join('\n')}
  </channel>
</rss>
`
}
