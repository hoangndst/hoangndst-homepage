'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import Image from '@/components/Image'
import Link from '@/components/Link'
import PostCoverPlaceholder from '@/components/PostCoverPlaceholder'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import type { PostMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import NextLink from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: PostMeta[]
  tagCounts: Record<string, number>
  title: string
  initialDisplayPosts?: PostMeta[]
  pagination?: PaginationProps
}

function BlogPagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage > 1
  const nextPage = currentPage < totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  )
  const pageTokens: Array<number | 'ellipsis'> = []
  let previousPage = 0

  for (const page of pageNumbers) {
    if (page - previousPage > 1) pageTokens.push('ellipsis')
    pageTokens.push(page)
    previousPage = page
  }

  return (
    <Pagination className="py-8">
      <PaginationContent>
        <PaginationItem>
          {prevPage ? (
            <PaginationPrevious
              href={
                currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`
              }
              rel="prev"
            />
          ) : (
            <PaginationPrevious aria-disabled="true" className="pointer-events-none opacity-50" href="#" />
          )}
        </PaginationItem>
        {pageTokens.map((token, index) => (
          <PaginationItem key={`${token}-${index}`}>
            {token === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink asChild isActive={token === currentPage}>
                <NextLink href={token === 1 ? `/${basePath}/` : `/${basePath}/page/${token}`}>
                  {token}
                </NextLink>
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          {nextPage ? (
            <PaginationNext href={`/${basePath}/page/${currentPage + 1}`} rel="next" />
          ) : (
            <PaginationNext aria-disabled="true" className="pointer-events-none opacity-50" href="#" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function PostRow({ post, index }: { post: PostMeta; index: number }) {
  const { path, date, title, summary, tags, images, authors = [] } = post

  return (
    <li>
      <div className="grid gap-4 py-6 md:grid-cols-[2rem_minmax(0,1fr)_10rem] md:items-center">
        <span className="text-muted-foreground font-mono text-xs">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-[10px]">
              @{authors[0] || 'hoangndst'}
            </Badge>
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </div>
          <h2 className="font-heading mt-2 text-lg font-semibold tracking-tight text-balance sm:text-xl">
            <Link href={`/${path}`} className="text-foreground transition-colors hover:text-primary">
              {title}
            </Link>
          </h2>
          <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-6 text-pretty">
            {summary}
          </p>
          <div className="mt-3 flex flex-wrap">
            {tags?.map((tag) => <Tag key={tag} text={tag} className="text-xs" />)}
          </div>
        </div>
        <Link href={`/${path}`} className="group hidden overflow-hidden md:block" aria-label={`Read ${title}`}>
          {images?.[0] ? (
            <Image
              alt=""
              src={images[0]}
              width={160}
              height={90}
              className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-300 group-hover:scale-[1.02] dark:outline-white/10"
              aria-hidden="true"
            />
          ) : (
            <PostCoverPlaceholder className="aspect-video w-full transition-transform duration-300 group-hover:scale-[1.02]" />
          )}
        </Link>
      </div>
    </li>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState('')
  const filteredPosts = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

    return posts.filter((post) => {
      const searchContent = [post.title, post.summary, ...(post.tags || [])].join(' ')
      return searchContent.toLowerCase().includes(query)
    })
  }, [initialDisplayPosts, posts, searchValue])

  const isTagPage = pathname.startsWith('/tags')
  const pageDescription = isTagPage
    ? `Posts about ${title.toLowerCase()}.`
    : 'Notes on software, systems, and the work behind keeping them useful.'

  return (
    <div className="mx-auto w-full sm:max-w-[768px]">
      <div className="pb-8 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/">Home</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isTagPage ? 'Tags' : title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <header className="pb-6">
        <p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.18em]">
          {isTagPage ? 'Topic' : 'Writing'}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty">
          {pageDescription}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <label htmlFor="search-articles" className="sr-only">
              Search posts
            </label>
            <Input
              id="search-articles"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search posts"
              className="pr-10"
            />
            <MagnifyingGlassIcon
              className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
          <Button asChild variant="ghost" size="sm" className="w-fit text-muted-foreground">
            <NextLink href="/tags">Browse tags</NextLink>
          </Button>
        </div>
      </header>

      <div className="pt-4">
        {filteredPosts.length > 0 ? (
          <ul className="border-border/70 divide-border/70 divide-y border-y">
            {filteredPosts.map((post, index) => (
              <PostRow key={post.path} post={post} index={index} />
            ))}
          </ul>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="font-heading text-sm font-semibold">
                {searchValue ? `No posts for “${searchValue}”` : 'No posts yet'}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchValue ? 'Try a different search term or browse all posts.' : 'New notes will appear here when they are ready.'}
              </p>
              {searchValue ? (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchValue('')}>
                  Clear search
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}

        {pagination && pagination.totalPages > 1 && !searchValue ? (
          <BlogPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        ) : null}
      </div>
    </div>
  )
}
