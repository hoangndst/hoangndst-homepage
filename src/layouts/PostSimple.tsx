import { ReactNode } from 'react'
import Comments from '@/components/Comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import PostNavigationButton from '@/components/PostNavigationButton'
import PostTopNavigation from '@/components/PostTopNavigation'
import BlogSources from '@/components/blog/BlogSources'
import type { PostMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import NextLink from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface LayoutProps {
  content: PostMeta
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, sources } = content
  const basePath = path.split('/')[0]
  const baseLabel = basePath.charAt(0).toUpperCase() + basePath.slice(1)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="flex items-center justify-between gap-4 pb-2 pt-6">
            <div className="min-w-0">
              <Breadcrumb>
                <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
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
                  <BreadcrumbItem className="min-w-0 max-w-full">
                    <BreadcrumbPage className="block min-w-0 truncate">{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <PostTopNavigation next={next} path={path} prev={prev} title={title} />
          </div>
          <header>
            <div className="flex flex-col gap-1 pb-10 text-center">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-muted-foreground text-base font-medium leading-6">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] pb-8">
            <div className="xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="typeset typeset-blog pb-8 pt-10">{children}</div>
            </div>
            <BlogSources sources={sources} />
            {siteMetadata.comments && (
              <div className="text-muted-foreground pb-6 pt-6 text-center" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer className="flex flex-col gap-4 sm:flex-row">
              <PostNavigationButton direction="next" post={next} />
              <PostNavigationButton direction="prev" post={prev} />
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
