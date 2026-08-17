'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import type { PostMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import Spotify from '@/components/Spotify'
import SectionContainer from '@/components/SectionContainer'
import Gopher from '@/components/Gopher'
import PostCoverPlaceholder from '@/components/PostCoverPlaceholder'
import DevQuotes from '@/components/DevQuotes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const MAX_DISPLAY = 4

interface HomeProps {
  posts: PostMeta[]
}

function PostListItem({ post, index }: { post: PostMeta; index: number }) {
  const { slug, date, title, summary, tags, images, authors = [] } = post
  const coverImage = images?.[0]

  return (
    <li>
      <div className="group grid gap-4 py-5 md:grid-cols-[2rem_minmax(0,1fr)_9rem] md:items-center">
        <span className="text-muted-foreground font-mono text-xs">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-[10px]">
              @{authors[0] || 'hoangndst'}
            </Badge>
            <time dateTime={date} suppressHydrationWarning>
              {formatDate(date, siteMetadata.locale)}
            </time>
          </div>
          <h3 className="font-heading mt-2 text-base font-semibold tracking-tight text-balance sm:text-lg">
            <Link
              href={`/blog/${slug}`}
              className="text-foreground transition-colors hover:text-primary"
              aria-label={`Read ${title}`}
            >
              {title}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-6 text-pretty">
            {summary}
          </p>
          <div className="mt-2 flex flex-wrap">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} className="text-[10px] sm:text-[11px]" />
            ))}
          </div>
        </div>
        <div className="hidden overflow-hidden sm:block">
          {coverImage ? (
            <Image
              alt=""
              src={coverImage}
              width={144}
              height={81}
              className="aspect-video w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 transition-transform duration-300 group-hover:scale-[1.02] dark:outline-white/10"
              aria-hidden="true"
            />
          ) : (
            <PostCoverPlaceholder className="aspect-video w-full transition-transform duration-300 group-hover:scale-[1.02]" />
          )}
        </div>
      </div>
    </li>
  )
}

export default function Home({ posts }: HomeProps) {
  const filteredPosts = posts.filter((post) => !post.tags?.includes('chocoboba'))

  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <section className="border-border/70 border-b py-10 sm:py-14" aria-labelledby="home-intro">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_12rem]">
            <div>
              <h1
                id="home-intro"
                className="font-heading max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl"
              >
                Building software for the real world.
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 text-pretty sm:text-lg">
                Notes from building tech stuff.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/blog">Read the blog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about">About</Link>
                </Button>
              </div>
            </div>
            <div className="border-border/70 hidden border-l pl-6 md:block">
              <Gopher />
            </div>
          </div>
        </section>

        <section className="border-border/70 grid gap-8 border-b py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-muted-foreground mb-4 font-mono text-[10px] uppercase tracking-[0.16em]">
              A thought worth keeping
            </p>
            <DevQuotes />
          </div>
          <div className="border-border/70 border-t pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-muted-foreground mb-4 font-mono text-[10px] uppercase tracking-[0.16em]">
              Listening now
            </p>
            <Spotify />
          </div>
        </section>

        <section aria-labelledby="latest-posts" className="pt-10">
          <div className="flex items-baseline justify-between gap-4 pb-4">
            <div>
              <p className="text-muted-foreground mb-2 font-mono text-xs uppercase tracking-[0.18em]">
                Field notes
              </p>
              <h2 id="latest-posts" className="font-heading text-xl font-semibold tracking-tight">
                Latest posts
              </h2>
            </div>
            {filteredPosts.length > MAX_DISPLAY ? (
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link href="/blog">View all</Link>
              </Button>
            ) : null}
          </div>

          {filteredPosts.length ? (
            <ul className="border-border/70 divide-border/70 divide-y border-y">
              {filteredPosts.slice(0, MAX_DISPLAY).map((post, index) => (
                <PostListItem key={post.slug} post={post} index={index} />
              ))}
            </ul>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="font-heading text-sm font-semibold">No posts yet</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  New notes will show up here when they are ready.
                </p>
              </CardContent>
            </Card>
          )}

          {filteredPosts.length > MAX_DISPLAY ? (
            <div className="flex justify-center pt-6">
              <Button asChild variant="outline">
                <Link href="/blog">Browse all posts</Link>
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </SectionContainer>
  )
}
