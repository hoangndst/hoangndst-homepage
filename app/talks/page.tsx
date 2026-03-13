import { allTalks } from 'contentlayer/generated'
import SectionContainer from '@/components/SectionContainer'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'
import Link from '@/components/Link'
import Breadcrumb from '@/components/Breadcrumb'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({ title: 'Talks' })

export default function Talks() {
  const talks = allTalks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div>
          <div className="space-y-2 pb-4 pt-6 md:space-y-5">
            <Breadcrumb />
            <p className="text-base leading-7 text-gray-700 dark:text-gray-200">
              I love to attend conferences, share and learn from community
            </p>
          </div>
          <div className="py-1">
            <ul className="space-y-3 pt-1">
              {talks.length === 0 && (
                <li className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  No talks found.
                </li>
              )}
              {talks.map((talk) => (
                <li key={talk.title}>
                  <article className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200/90 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 sm:flex-row sm:p-4">
                    <div className="w-full flex-shrink-0 sm:block sm:w-auto">
                      <Link href={talk.url || '#'} target="_blank" className="block w-full">
                        <Image
                          alt={talk.title}
                          src={talk.image || '/static/images/golang.png'}
                          className="aspect-video w-full rounded-lg border border-gray-200 object-cover object-center dark:border-gray-800 sm:w-[260px]"
                          width={260}
                          height={146}
                        />
                      </Link>
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-base font-bold leading-7 tracking-tight text-gray-900 dark:text-gray-100 sm:text-lg">
                          <Link
                            href={talk.url || '#'}
                            className="text-gray-900 transition-colors duration-200 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                            target="_blank"
                          >
                            {talk.title}
                          </Link>
                        </h2>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-primary-600 dark:bg-gray-800 dark:text-primary-400">
                            {talk.event}
                          </span>
                          <span>•</span>
                          <time dateTime={talk.date}>
                            {formatDate(talk.date, siteMetadata.locale)}
                          </time>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-gray-600 dark:text-gray-300">
                          {talk.summary}
                        </p>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
