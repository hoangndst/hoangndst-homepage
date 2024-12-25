type Blog = {
  _id: string
  type: 'Blog'
  title: string
  date: string
  tags: string[]
  lastmod?: string | undefined
  draft?: boolean | undefined
  summary?: string | undefined
  images?: any | undefined
  authors?: string[] | undefined
  layout?: string | undefined
  bibliography?: string | undefined
  canonicalUrl?: string | undefined
  body: ReactNode
  readingTime: json
  slug: string
  path: string
  filePath: string
  toc: json
  structuredData: json
}
