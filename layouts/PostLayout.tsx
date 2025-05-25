import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TOC from '@/components/TOC'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, readingTime, toc } = content
  const basePath = path.split('/')[0]

  return (
    <>
      <div className="grid grid-cols-[minmax(0px,1fr)_min(768px,100%)_minmax(0px,1fr)] gap-y-6 pt-4 *:px-4">
        <section className="col-start-2 flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-3 text-center">
            <div>
              <PageTitle>{title}</PageTitle>
            </div>
            <dl className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
              <div>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </time>
                  {readingTime && (
                    <>
                      <span className="mx-2">|</span>
                      <span>{readingTime.text}</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
            <dl>
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <div className="whitespace-nowrap text-left text-sm font-medium leading-5">
                        <div className="text-gray-900 dark:text-gray-100">{author.name}</div>
                        {author.github && (
                          <Link
                            href={author.github}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {author.github.replace('https://github.com/', '@')}
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            {tags && (
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} className="text-xs" />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Next Post Button (left) */}
            {next && next.path ? (
              <Link
                href={`/${next.path}`}
                aria-label="Next Post"
                className="focus-visible:ring-ring border-input group flex h-full w-full items-center justify-start whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:w-1/2"
              >
                <div className="mr-2 flex-shrink-0">
                  <svg
                    width="1em"
                    height="1em"
                    className="size-4 transition-transform group-hover:-translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19l-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-wrap">
                  <span className="text-muted-foreground text-left text-xs">Next Post</span>
                  <span className="w-full text-ellipsis text-pretty text-left text-sm">
                    {next.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="border-input flex h-full w-full cursor-not-allowed items-center justify-start whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium opacity-50 transition-colors duration-150 ease-in-out dark:border-gray-800 dark:bg-gray-950 sm:w-1/2">
                <div className="mr-2 flex-shrink-0">
                  <svg
                    width="1em"
                    height="1em"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19l-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-wrap">
                  <span className="text-muted-foreground text-left text-xs">Next Post</span>
                  <span className="w-full text-ellipsis text-pretty text-left text-sm">
                    Latest Post
                  </span>
                </div>
              </div>
            )}
            {/* Previous Post Button (right) */}
            {prev && prev.path ? (
              <Link
                href={`/${prev.path}`}
                aria-label="Previous Post"
                className="focus-visible:ring-ring border-input group flex h-full w-full items-center justify-end whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:w-1/2"
              >
                <div className="order-2 mr-2 flex flex-col items-end text-wrap">
                  <span className="text-muted-foreground text-right text-xs">Previous Post</span>
                  <span className="w-full text-ellipsis text-pretty text-right text-sm">
                    {prev.title}
                  </span>
                </div>
                <div className="order-3 flex-shrink-0">
                  <svg
                    width="1em"
                    height="1em"
                    className="size-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5l7 7-7 7" />
                    <path d="M5 12h14" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div className="border-input flex h-full w-full cursor-not-allowed items-center justify-end whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium opacity-50 transition-colors duration-150 ease-in-out dark:border-gray-800 dark:bg-gray-950 sm:w-1/2">
                <div className="order-2 mr-2 flex flex-col items-end text-wrap">
                  <span className="text-muted-foreground text-right text-xs">Previous Post</span>
                  <span className="w-full text-ellipsis text-pretty text-right text-sm">
                    Last Post
                  </span>
                </div>
                <div className="order-3 flex-shrink-0">
                  <svg
                    width="1em"
                    height="1em"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5l7 7-7 7" />
                    <path d="M5 12h14" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </section>
        <TOC toc={toc} />
        <article className="prose col-start-2 max-w-none dark:prose-invert [&>:first-child>*]:mt-0">
          {children}
        </article>
        <div className="col-start-2 flex flex-col gap-4 sm:flex-row">
          {/* Next Post Button (left) */}
          {next && next.path ? (
            <Link
              href={`/${next.path}`}
              aria-label="Next Post"
              className="focus-visible:ring-ring border-input group flex h-full w-full items-center justify-start whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:w-1/2"
            >
              <div className="mr-2 flex-shrink-0">
                <svg
                  width="1em"
                  height="1em"
                  className="size-4 transition-transform group-hover:-translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </div>
              <div className="flex flex-col items-start text-wrap">
                <span className="text-muted-foreground text-left text-xs">Next Post</span>
                <span className="w-full text-ellipsis text-pretty text-left text-sm">
                  {next.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="border-input flex h-full w-full cursor-not-allowed items-center justify-start whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium opacity-50 transition-colors duration-150 ease-in-out dark:border-gray-800 dark:bg-gray-950 sm:w-1/2">
              <div className="mr-2 flex-shrink-0">
                <svg
                  width="1em"
                  height="1em"
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </div>
              <div className="flex flex-col items-start text-wrap">
                <span className="text-muted-foreground text-left text-xs">Next Post</span>
                <span className="w-full text-ellipsis text-pretty text-left text-sm">
                  Latest Post
                </span>
              </div>
            </div>
          )}
          {/* Previous Post Button (right) */}
          {prev && prev.path ? (
            <Link
              href={`/${prev.path}`}
              aria-label="Previous Post"
              className="focus-visible:ring-ring border-input group flex h-full w-full items-center justify-end whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:w-1/2"
            >
              <div className="order-2 mr-2 flex flex-col items-end text-wrap">
                <span className="text-muted-foreground text-right text-xs">Previous Post</span>
                <span className="w-full text-ellipsis text-pretty text-right text-sm">
                  {prev.title}
                </span>
              </div>
              <div className="order-3 flex-shrink-0">
                <svg
                  width="1em"
                  height="1em"
                  className="size-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5l7 7-7 7" />
                  <path d="M5 12h14" />
                </svg>
              </div>
            </Link>
          ) : (
            <div className="border-input flex h-full w-full cursor-not-allowed items-center justify-end whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-sm font-medium opacity-50 transition-colors duration-150 ease-in-out dark:border-gray-800 dark:bg-gray-950 sm:w-1/2">
              <div className="order-2 mr-2 flex flex-col items-end text-wrap">
                <span className="text-muted-foreground text-right text-xs">Previous Post</span>
                <span className="w-full text-ellipsis text-pretty text-right text-sm">
                  Last Post
                </span>
              </div>
              <div className="order-3 flex-shrink-0">
                <svg
                  width="1em"
                  height="1em"
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5l7 7-7 7" />
                  <path d="M5 12h14" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="col-start-2 max-w-none divide-y divide-gray-200 dark:divide-gray-700">
          <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
            <Link href={discussUrl(path)} rel="nofollow">
              Discuss on X
            </Link>
            {` • `}
            <Link href={editUrl(filePath)}>View on GitHub</Link>
          </div>
          {siteMetadata.comments && (
            <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
        </div>
      </div>
      <ScrollTopAndComment />
    </>
  )
}
