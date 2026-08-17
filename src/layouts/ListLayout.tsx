'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import type { PostMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import NextLink from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: PostMeta[]
  title: string
  initialDisplayPosts?: PostMeta[]
  pagination?: PaginationProps
}

function BlogPagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  )
  const pageTokens: Array<number | 'ellipsis'> = []
  let previousPage = 0

  for (const page of pageNumbers) {
    if (page - previousPage > 1) {
      pageTokens.push('ellipsis')
    }
    pageTokens.push(page)
    previousPage = page
  }

  return (
    <Pagination className="pb-8 pt-6">
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
            <PaginationPrevious
              aria-disabled="true"
              className="pointer-events-none opacity-50"
              href="#"
            />
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
            <PaginationNext
              aria-disabled="true"
              className="pointer-events-none opacity-50"
              href="#"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div>
        <div className="flex flex-col gap-2 pb-8 pt-6 md:gap-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <NextLink href="/">Home</NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative max-w-lg">
            <label htmlFor="search-articles" className="sr-only">
              Search articles
            </label>
            <Input
              id="search-articles"
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="pr-10"
            />
            <MagnifyingGlassIcon
              className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && (
            <li className="py-4">
              <Card className="py-0">
                <CardContent className="text-muted-foreground py-4 text-sm">
                  No posts found.
                </CardContent>
              </Card>
            </li>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} className="py-4">
                <Card className="py-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold sm:text-xl">
                      <Link href={`/${path}`} className="text-foreground hover:text-foreground/80">
                        {title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">{summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 pb-3">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap">
                      {tags?.map((tag) => <Tag key={tag} text={tag} className="text-xs" />)}
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <BlogPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
