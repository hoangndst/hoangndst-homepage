import Link from '@/components/Link'
import { slug } from 'github-slugger'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import { getTagCounts } from '@/lib/content'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'
import NextLink from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = genPageMetadata({
  title: 'Tags',
  description: 'Things I blog about',
})

export default async function Page() {
  const tagCounts = getTagCounts()
  const sortedTags = Object.entries(tagCounts).sort(([, countA], [, countB]) => countB - countA)

  return (
    <SectionContainer>
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
                <BreadcrumbPage>Tags</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <header className="border-border/70 border-b pb-8">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.18em]">
            Index
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tags
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty">
            The subjects behind the notes.
          </p>
        </header>

        {sortedTags.length > 0 ? (
          <ul className="border-border/70 divide-border/70 divide-y border-y">
            {sortedTags.map(([tag, count], index) => (
              <li key={tag}>
                <Link
                  href={`/tags/${slug(tag)}`}
                  className="group flex min-h-16 items-center gap-4 py-4"
                  aria-label={`View ${count} ${count === 1 ? 'post' : 'posts'} tagged ${tag}`}
                >
                  <span className="text-muted-foreground w-8 shrink-0 font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-foreground min-w-0 flex-1 truncate text-base font-medium">
                    #{tag}
                  </span>
                  <Badge variant="secondary" className="shrink-0">
                    {count} {count === 1 ? 'post' : 'posts'}
                  </Badge>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className="text-muted-foreground size-4 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground border-border/70 border-y py-8 text-sm">
            No tags yet.
          </p>
        )}
      </div>
    </SectionContainer>
  )
}
