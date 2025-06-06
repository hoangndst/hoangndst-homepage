import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import Talk from '@/components/Talk'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Spotify from '@/components/Spotify'
import SectionContainer from '@/components/SectionContainer'
import Gopher from '@/components/Gopher'
import DevQuotes from '@/components/DevQuotes'

const MAX_DISPLAY = 4

export default function Home({ posts }) {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-4 pt-6 sm:px-4 md:space-y-5 lg:px-0">
          <div className="flex flex-col space-y-2 pt-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-y-5">
            <div className="w-full text-center md:text-left">
              <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                I'm{' '}
                <span className="dark:from-secondary-700 dark:to-secondary-400 mt-10 bg-gradient-to-r from-primary-700 to-primary-400 bg-clip-text text-center text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                  @hoangndst
                </span>{' '}
                👨‍💻
              </h1>
              <div className="dark:text-grey text-gray mt-4 text-base sm:text-lg">
                Platform Engineer | Speaker 🎤
              </div>
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
          <Talk />
          <p className="text-gray dark:text-gray px-2 text-base leading-7 sm:px-0 sm:text-lg">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="pt-4">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, images, readingTime, authors = [] } = post
            return (
              <li key={slug} className="px-1 py-2 sm:px-1 sm:py-2">
                <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-150 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:flex-row">
                  <div className="flex flex-shrink-0 items-center justify-center sm:block">
                    <Image
                      alt={title}
                      src={images[0]}
                      className="h-[150px] w-full rounded-lg object-cover object-center sm:w-[215px]"
                      width={215}
                      height={150}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
                        <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h2>
                      <div className="prose mt-2 max-w-none text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        {summary}
                      </div>
                      <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center">
                          @{authors?.[0] || 'hoangndst'}
                        </span>
                        <span>|</span>
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        <span>|</span>
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
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end px-2 pt-4 text-base font-medium leading-6 sm:px-0">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-primary-500 transition-colors duration-150 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.707 15.707a1 1 0 010-1.414L11.586 11H4a1 1 0 110-2h7.586l-3.879-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      )}
    </SectionContainer>
  )
}
