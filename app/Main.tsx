import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Spotify from '@/components/Spotify'
import SectionContainer from '@/components/SectionContainer'
import Gopher from '@/components/Gopher'
import DevQuotes from '@/components/DevQuotes'

const MAX_DISPLAY = 4

export default function Home({ posts }) {
  const filteredPosts = posts.filter((post) => !post.tags?.includes('chocoboba'))
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div>
          <div className="space-y-2 pb-4 pt-6 sm:px-4 md:space-y-5 lg:px-0">
            <div className="flex flex-col space-y-2 pt-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-y-5">
              <div className="w-full text-center md:text-left">
                <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                  I'm{' '}
                  <span className="dark:from-secondary-700 dark:to-secondary-400 mt-10 bg-gradient-to-r from-primary-700 to-primary-400 bg-clip-text text-center text-2xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                    @hoangndst
                  </span>{' '}
                  👨‍💻
                </h1>
              </div>
              <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto md:justify-end">
                <Gopher />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center px-2 sm:px-0">
              <DevQuotes />
            </div>
            <div className="flex flex-wrap items-center justify-center sm:px-0">
              <Spotify />
            </div>
            <p className="text-gray dark:text-gray px-2 text-base leading-7 sm:px-0 sm:text-lg">
              {siteMetadata.description}
            </p>
          </div>
          <ul className="space-y-3 pt-4">
            {!filteredPosts.length && (
              <li className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No posts found.
              </li>
            )}
            {filteredPosts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags, images, readingTime, authors = [] } = post
              return (
                <li key={slug}>
                  <article className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200/90 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 sm:flex-row sm:p-4">
                    <div className="flex flex-shrink-0 items-center justify-center sm:block">
                      <Image
                        alt={title}
                        src={images[0]}
                        className="h-[140px] w-full rounded-lg border border-gray-200 object-cover object-center dark:border-gray-800 sm:w-[210px]"
                        width={210}
                        height={140}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-bold leading-7 tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl">
                          <Link
                            href={`/blog/${slug}`}
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
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          <span>•</span>
                          <span>{readingTime.text}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} className="text-xs" />
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
        {filteredPosts.length > MAX_DISPLAY && (
          <div className="flex justify-center px-2 pt-4 text-sm font-medium leading-6 sm:px-0">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-primary-500 transition-colors duration-150 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-400"
              aria-label="All posts"
            >
              All Posts
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 15.707a1 1 0 010-1.414L11.586 11H4a1 1 0 110-2h7.586l-3.879-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}
