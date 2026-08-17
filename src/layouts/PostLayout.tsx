import { ReactNode } from 'react'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TOC from '@/components/TOC'
import PostNavigationButton from '@/components/PostNavigationButton'
import type { AuthorMeta, PostMeta } from '@/lib/content'
import NextLink from 'next/link'
import { formatDate } from '@/lib/utils/format-date'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/src/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

interface LayoutProps {
  content: PostMeta
  authorDetails: AuthorMeta[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, readingTime, toc, summary } = content
  const basePath = path.split('/')[0]
  const baseLabel = basePath.charAt(0).toUpperCase() + basePath.slice(1)

  return (
    <>
      <div className="grid grid-cols-[minmax(0px,1fr)_min(768px,100%)_minmax(0px,1fr)] gap-y-8 pt-4 *:px-4">
        <section className="col-start-2 flex flex-col gap-y-8">
          <div className="pt-2 sm:-mx-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NextLink href="/">Home</NextLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NextLink href={`/${basePath}`}>{baseLabel}</NextLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <header className="border-border/70 border-b pb-8">
            <PageTitle className="mx-auto max-w-3xl text-center">{title}</PageTitle>
            {summary && (
              <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-pretty">
                {summary}
              </p>
            )}
            <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
              {readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime.text}</span>
                </>
              )}
            </div>
            <dl className="mt-5">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4">
                  {authorDetails.map((author) => (
                    <li className="flex items-center gap-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-9 w-9 object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                        />
                      )}
                      <div className="whitespace-nowrap text-left text-sm font-medium leading-5">
                        <div className="text-foreground">{author.name}</div>
                        {author.github && (
                          <Link
                            href={author.github}
                            className="text-muted-foreground hover:text-foreground transition-colors"
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
              <div className="mt-5 flex flex-wrap justify-center">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} className="text-xs" />
                ))}
              </div>
            )}
          </header>
        </section>
        <TOC toc={toc} />
        <article className="typeset typeset-blog col-start-2">{children}</article>
        <div className="col-start-2 flex flex-col gap-4 sm:flex-row">
          <PostNavigationButton direction="next" post={next} />
          <PostNavigationButton direction="prev" post={prev} />
        </div>
        <div className="col-start-2 flex flex-col gap-6">
          <div className="text-muted-foreground pb-6 pt-6 text-sm">
            <Link href={discussUrl(path)} rel="nofollow">
              Discuss on X
            </Link>
            {` • `}
            <Link href={editUrl(filePath)}>View on GitHub</Link>
          </div>
          {siteMetadata.comments && (
            <div className="text-muted-foreground pb-6 pt-6 text-center" id="comment">
              <Comments slug={slug} />
            </div>
          )}
        </div>
      </div>
      <ScrollTopAndComment />
    </>
  )
}
