import type { Metadata } from 'next'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'

import GithubCalendar from '@/components/Github'
import Image from '@/components/Image'
import Link from '@/components/Link'
import PostCoverPlaceholder from '@/components/PostCoverPlaceholder'
import SectionContainer from '@/components/SectionContainer'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'

export const metadata: Metadata = genPageMetadata({ title: 'Projects' })

const isGithubUrl = (url?: string) =>
  Boolean(url && /(^https?:\/\/)?(www\.)?github\.com\/.+/i.test(url))

function ProjectThumbnail({
  title,
  imgSrc,
  featured = false,
}: {
  title: string
  imgSrc?: string
  featured?: boolean
}) {
  if (!imgSrc) {
    return <PostCoverPlaceholder className="aspect-video w-full" />
  }

  return (
    <Image
      alt={`${title} project preview`}
      src={imgSrc}
      className={`aspect-video w-full object-cover object-center ${featured ? '' : 'md:w-36'}`}
      width={featured ? 720 : 144}
      height={featured ? 405 : 81}
    />
  )
}

function ProjectActions({
  title,
  href,
  blogHref,
}: {
  title: string
  href?: string
  blogHref?: string
}) {
  if (!href && !blogHref) return null

  return (
    <div className="flex flex-wrap gap-2">
      {href ? (
        <Button asChild variant="outline" size="xs">
          <Link href={href} target="_blank" aria-label={`View ${title}`}>
            View project
            <ArrowUpRightIcon />
          </Link>
        </Button>
      ) : null}
      {blogHref ? (
        <Button asChild variant="ghost" size="xs">
          <Link href={blogHref}>Read write-up</Link>
        </Button>
      ) : null}
    </div>
  )
}

export default function Projects() {
  const [featuredProject, ...otherProjects] = projectsData

  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <Breadcrumb className="pt-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="border-border/70 border-b pb-8 pt-10">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.18em]">
            Selected work
          </p>
          <h1 className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Projects
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-pretty text-base leading-7">
            Software engineering, cloud infrastructure, AI, and notes from building things.
          </p>
        </header>

        {featuredProject ? (
          <section aria-label="Featured project" className="pt-8">
            <div className="mb-4 flex justify-end">
              <span className="text-muted-foreground font-mono text-xs">01</span>
            </div>
            <Card>
              <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div className="border-border/70 border-b md:border-b-0 md:border-r">
                  <ProjectThumbnail
                    title={featuredProject.title}
                    imgSrc={featuredProject.imgSrc}
                    featured
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <CardHeader className="gap-3">
                    <div className="flex flex-wrap gap-2">
                      {isGithubUrl(featuredProject.href) ? (
                        <Badge variant="outline">
                          <Image
                            src="/icons/github-mono.svg"
                            alt=""
                            width={12}
                            height={12}
                            className="size-3 dark:invert"
                            aria-hidden="true"
                          />
                          GitHub
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className="font-heading text-balance text-xl font-semibold tracking-tight">
                      {featuredProject.title.trim()}
                    </h3>
                    <CardDescription className="text-pretty text-sm leading-6">
                      {featuredProject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ProjectActions
                      title={featuredProject.title.trim()}
                      href={featuredProject.href}
                      blogHref={featuredProject.blogHref}
                    />
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        <section aria-labelledby="other-projects" className="pt-10">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="other-projects" className="font-heading text-sm font-semibold">
              More work
            </h2>
            <span className="text-muted-foreground font-mono text-xs">
              {String(otherProjects.length).padStart(2, '0')}
            </span>
          </div>

          {otherProjects.length > 0 ? (
            <ul className="border-border/70 divide-border/70 divide-y border-y">
              {otherProjects.map((project, index) => {
                const title = project.title.trim()

                return (
                  <li
                    key={title}
                    className="grid gap-4 py-5 md:grid-cols-[2rem_minmax(0,1fr)_auto] md:items-center"
                  >
                    <span className="text-muted-foreground font-mono text-xs">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-balance text-base font-semibold tracking-tight">
                            {title}
                          </h3>
                          {isGithubUrl(project.href) ? (
                            <Badge variant="outline" className="text-[0.65rem]">
                              <Image
                                src="/icons/github-mono.svg"
                                alt=""
                                width={12}
                                height={12}
                                className="size-3 dark:invert"
                                aria-hidden="true"
                              />
                              GitHub
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-muted-foreground mt-1.5 text-pretty text-sm leading-6">
                          {project.description}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <ProjectThumbnail title={title} imgSrc={project.imgSrc} />
                      </div>
                    </div>
                    <ProjectActions title={title} href={project.href} blogHref={project.blogHref} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="font-heading text-sm font-semibold">No projects yet</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Project links will appear here when they are ready.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <section aria-labelledby="github-activity" className="border-border/70 mt-12 border-t py-8">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              <h2 id="github-activity" className="font-heading text-sm font-semibold">
                GitHub activity
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                A small record of the work between releases.
              </p>
            </div>
            <Link
              href="https://github.com/hoangndst"
              target="_blank"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              @hoangndst
            </Link>
          </div>
          <GithubCalendar username="hoangndst" />
        </section>
      </div>
    </SectionContainer>
  )
}
