/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Breadcrumb from '@/components/Breadcrumb'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  const prevPage = currentPage > 1
  const nextPage = currentPage < totalPages

  return (
    <nav className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Button */}
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          className="rounded px-2 py-1 text-sm transition-colors duration-150 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-primary-500"
        >
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.293 4.293a1 1 0 010 1.414L8.414 9H16a1 1 0 110 2H8.414l3.879 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </span>
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded px-2 py-1 text-sm opacity-50">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.293 4.293a1 1 0 010 1.414L8.414 9H16a1 1 0 110 2H8.414l3.879 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </span>
        </span>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((num) => (
        <Link
          key={num}
          href={num === 1 ? `/${basePath}/` : `/${basePath}/page/${num}`}
          className={`mx-3 rounded px-3 py-1 text-sm transition-colors duration-150 ${
            num === currentPage
              ? 'border border-gray-300 bg-gray-200 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              : 'hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-primary-500'
          }`}
        >
          {num}
        </Link>
      ))}

      {/* Next Button */}
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          className="rounded px-2 py-1 text-sm transition-colors duration-150 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-primary-500"
        >
          <span className="flex items-center gap-1">
            Next
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.707 15.707a1 1 0 010-1.414L11.586 11H4a1 1 0 110-2h7.586l-3.879-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded px-2 py-1 text-sm opacity-50">
          <span className="flex items-center gap-1">
            Next
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.707 15.707a1 1 0 010-1.414L11.586 11H4a1 1 0 110-2h7.586l-3.879-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="pb-6 pt-6">
          <Breadcrumb />
        </div>
        <div className="flex sm:space-x-6">
          <div className="border-input hidden h-fit max-h-screen min-w-[280px] max-w-[280px] overflow-auto rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:block">
            <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-800">
              {pathname.startsWith('/blog') ? (
                <h3 className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="flex w-full rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  All Posts
                </Link>
              )}
            </div>
            <ul className="space-y-1.5">
              {sortedTags.map((t) => {
                const isActiveTag = decodeURI(pathname.split('/tags/')[1]) === slug(t)

                return (
                  <li key={t}>
                    {isActiveTag ? (
                      <h3 className="flex items-center justify-between rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                        <span className="truncate">{t}</span>
                        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                          {tagCounts[t]}
                        </span>
                      </h3>
                    ) : (
                      <Link
                        href={`/tags/${slug(t)}`}
                        className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        aria-label={`View posts tagged ${t}`}
                      >
                        <span className="truncate">{t}</span>
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                          {tagCounts[t]}
                        </span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="min-w-0 flex-1">
            <ul className="w-full space-y-3">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, authors = [] } = post
                return (
                  <li key={path} className="w-full">
                    <article className="group w-full rounded-xl border border-gray-200/90 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold leading-7 tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl">
                          <Link
                            href={`/${path}`}
                            className="text-gray-900 transition-colors duration-200 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                          >
                            {title}
                          </Link>
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {summary}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">
                            @{authors?.[0] || 'hoangndst'}
                          </span>
                          <span>•</span>
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </div>
                        <div className="mt-2 flex flex-wrap">
                          {tags?.map((tag) => <Tag key={tag} text={tag} className="text-xs" />)}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
