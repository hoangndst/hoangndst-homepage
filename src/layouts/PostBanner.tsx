import { ReactNode } from 'react'
import Image from '@/components/Image'
import Comments from '@/components/Comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import PostNavigationButton from '@/components/PostNavigationButton'
import PostTopNavigation from '@/components/PostTopNavigation'
import BlogSources from '@/components/blog/BlogSources'
import PostCoverPlaceholder from '@/components/PostCoverPlaceholder'
import type { PostMeta } from '@/lib/content'
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

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images, path, sources } = content
  const displayImage = images?.[0]
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
          <div className="flex flex-col gap-1 pb-10 text-center">
            <div className="w-full">
              <div className="relative -mx-4 aspect-[2/1] w-[calc(100%+2rem)] sm:-mx-8 sm:w-[calc(100%+4rem)]">
                {displayImage ? (
                  <Image src={displayImage} alt={title} fill className="object-cover" />
                ) : (
                  <PostCoverPlaceholder className="absolute inset-0" />
                )}
              </div>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="typeset typeset-blog py-4">{children}</div>
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
      </article>
    </SectionContainer>
  )
}
