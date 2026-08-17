import type { Metadata } from 'next'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'
import { genPageMetadata } from 'app/seo'

import Image from '@/components/Image'
import Link from '@/components/Link'
import PostCoverPlaceholder from '@/components/PostCoverPlaceholder'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { getTalksSortedByDate } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import NextLink from 'next/link'

export const metadata: Metadata = genPageMetadata({ title: 'Talks' })

function TalkPreview({ title, image }: { title: string; image?: string }) {
  if (!image) return <PostCoverPlaceholder className="aspect-video w-full" />

  return (
    <Image
      alt={`${title} talk preview`}
      src={image}
      width={192}
      height={108}
      className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
    />
  )
}

export default function Talks() {
  const talks = getTalksSortedByDate()

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
                <BreadcrumbPage>Talks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <header className="border-border/70 border-b pb-8">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.18em]">
            Community work
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Talks
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 text-pretty">
            Conferences, community sessions, and notes from sharing what I&apos;ve learned.
          </p>
        </header>

        {talks.length > 0 ? (
          <ul className="border-border/70 divide-border/70 divide-y border-y">
            {talks.map((talk, index) => (
              <li key={talk.title}>
                <article className="grid gap-5 py-6 md:grid-cols-[2rem_minmax(0,1fr)_12rem] md:items-center">
                  <span className="text-muted-foreground font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary" className="text-[10px]">
                        {talk.event}
                      </Badge>
                      <time dateTime={talk.date}>{formatDate(talk.date, siteMetadata.locale)}</time>
                    </div>
                    <h2 className="font-heading mt-2 text-lg font-semibold tracking-tight text-balance sm:text-xl">
                      {talk.url ? (
                        <Link href={talk.url} target="_blank" className="text-foreground hover:text-primary transition-colors">
                          {talk.title}
                        </Link>
                      ) : (
                        talk.title
                      )}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6 text-pretty">
                      {talk.summary}
                    </p>
                    {talk.url ? (
                      <Button asChild variant="outline" size="xs" className="mt-4">
                        <Link href={talk.url} target="_blank" aria-label={`View ${talk.title}`}>
                          View talk
                          <ArrowUpRightIcon data-icon="inline-end" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                  <div className="order-last md:order-none">
                    {talk.url ? (
                      <Link href={talk.url} target="_blank" aria-label={`View ${talk.title}`}>
                        <TalkPreview title={talk.title} image={talk.image} />
                      </Link>
                    ) : (
                      <TalkPreview title={talk.title} image={talk.image} />
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <Card className="mt-8">
            <CardContent className="py-8">
              <p className="font-heading text-sm font-semibold">No talks yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                New conference and community sessions will appear here when they are ready.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SectionContainer>
  )
}
