import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import { genPageMetadata } from 'app/seo'
import { getTags } from '@/lib/tag'
import { Suspense } from 'react'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

const LoadingSkeleton = () => {
  return (
    <div className="flex max-w-lg animate-pulse flex-wrap">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="mb-2 mr-5 mt-2">
          {/* Simulated Tag */}
          <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700"></div>
          {/* Simulated Link */}
          <div className="mt-1 h-4 w-20 rounded bg-gray-300 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  )
}

export default async function Page() {
  const tagData = await getTags()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="flex max-w-lg flex-wrap">
            {tagKeys.length === 0 && 'No tags found.'}
            {sortedTags.map((t) => {
              return (
                <div key={t} className="mb-2 mr-5 mt-2">
                  <Tag text={t} />
                  <Link
                    href={`/tags/${slug(t)}`}
                    className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                    aria-label={`View posts tagged ${t}`}
                  >
                    {` (${tagCounts[t]})`}
                  </Link>
                </div>
              )
            })}
          </div>
        </Suspense>
      </div>
    </>
  )
}
