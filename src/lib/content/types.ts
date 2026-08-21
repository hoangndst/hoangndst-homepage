export type PostLayoutKey = 'PostLayout' | 'PostSimple' | 'PostBanner'

export interface TocItem {
  value: string
  url: string
  depth: number
}

export interface ReadingTimeMeta {
  text: string
  minutes: number
}

export interface Source {
  title: string
  url: string
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  lastmod?: string
  summary?: string
  tags: string[]
  authors: string[]
  images?: string[]
  layout: PostLayoutKey
  draft: boolean
  readingTime: ReadingTimeMeta
  toc: TocItem[]
  sources: Source[]
  path: string
  filePath: string
}

export interface AuthorMeta {
  slug: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  location?: string
  email?: string
  x?: string
  linkedin?: string
  github?: string
}

export interface TalkMeta {
  slug: string
  title: string
  event: string
  date: string
  summary?: string
  url: string
  image?: string
}

export interface SearchDocument {
  title: string
  slug: string
  summary?: string
  tags: string[]
  content?: string
}
