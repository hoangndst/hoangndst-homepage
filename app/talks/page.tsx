import { allTalks } from 'contentlayer/generated'
import SectionContainer from '@/components/SectionContainer'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'
import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({ title: 'Talks' })

export default function Talks() {
  const talks = allTalks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Talks
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Conference talks and presentations.
          </p>
        </div>
        <div className="container py-6">
          <ul className="pt-4">
            {talks.map((talk) => (
              <li key={talk.title} className="px-1 py-2 sm:px-1 sm:py-2">
                <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-150 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:flex-row">
                  <div className="w-full flex-shrink-0 sm:block sm:w-auto">
                    <Link href={talk.url || '#'} target="_blank" className="block w-full">
                      <Image
                        alt={talk.title}
                        src={talk.image || '/static/images/golang.png'}
                        className="aspect-video w-full rounded-lg object-cover object-center sm:w-[300px]"
                        width={300}
                        height={158}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl">
                        <Link
                          href={talk.url || '#'}
                          className="text-gray-900 dark:text-gray-100"
                          target="_blank"
                        >
                          {talk.title}
                        </Link>
                      </h2>
                      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center text-primary-500">{talk.event}</span>
                        <span>|</span>
                        <time dateTime={talk.date}>{formatDate(talk.date, siteMetadata.locale)}</time>
                      </div>
                      <div className="prose mt-2 max-w-none text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        {talk.summary}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionContainer>
  )
}
