import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="space-y-2 pb-8 pt-6 md:space-y-4">
          <Breadcrumb />
          <p className="text-base leading-7 text-gray-700 dark:text-gray-200">
            Explore topics I write about.
          </p>
        </div>
        <div>
          {tagKeys.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No tags found.
            </div>
          )}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {sortedTags.map((t) => {
              return (
                <li key={t}>
                  <Link
                    href={`/tags/${slug(t)}`}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors duration-150 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                    aria-label={`View posts tagged ${t}`}
                  >
                    <span className="truncate text-sm font-medium uppercase tracking-wide text-gray-700 dark:text-gray-200">
                      #{t}
                    </span>
                    <span className="ml-3 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {tagCounts[t]}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </SectionContainer>
  )
}
