import { authors, posts, talks } from './generated/manifest'
import { slug as slugify } from 'github-slugger'
import type { AuthorMeta, PostMeta, TalkMeta } from './types'

const toTimestamp = (value: string) => new Date(value).getTime()

export const getPosts = (): PostMeta[] => posts

export const getAuthors = (): AuthorMeta[] => authors

export const getTalks = (): TalkMeta[] => talks

export const getTalksSortedByDate = (): TalkMeta[] =>
  talks.slice().sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))

export const getPublishedPosts = (): PostMeta[] =>
  posts
    .filter((post) => !post.draft)
    .slice()
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))

export const getPost = (slug: string): PostMeta | undefined => posts.find((post) => post.slug === slug)

export const getPostsByTag = (tag: string): PostMeta[] =>
  getPublishedPosts().filter((post) => post.tags.map((item) => slugify(item)).includes(tag))

export const getTagCounts = (): Record<string, number> => {
  return getPublishedPosts().reduce<Record<string, number>>((accumulator, post) => {
    for (const tag of post.tags) {
      const key = slugify(tag)
      accumulator[key] = (accumulator[key] ?? 0) + 1
    }
    return accumulator
  }, {})
}

export const getAuthor = (slug: string): AuthorMeta | undefined =>
  authors.find((author) => author.slug === slug)

export const getAuthorsBySlugs = (authorSlugs: string[]): AuthorMeta[] =>
  authorSlugs
    .map((slug) => getAuthor(slug))
    .filter((author): author is AuthorMeta => Boolean(author))

export const getAdjacentPosts = (slug: string) => {
  const sortedPosts = getPublishedPosts()
  const index = sortedPosts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return { prev: undefined, next: undefined }
  }

  return {
    prev: sortedPosts[index + 1]
      ? { path: sortedPosts[index + 1].path, title: sortedPosts[index + 1].title }
      : undefined,
    next: sortedPosts[index - 1]
      ? { path: sortedPosts[index - 1].path, title: sortedPosts[index - 1].title }
      : undefined,
  }
}
