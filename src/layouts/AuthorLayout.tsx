import { ReactNode } from 'react'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import Spotify from '@/components/Spotify'
import { getTalksSortedByDate, type AuthorMeta, type TalkMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils/format-date'
import NextLink from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Props {
  children: ReactNode
  content: AuthorMeta
}

function TimelineItem({
  title,
  subtitle,
  date,
  logo,
}: {
  title: ReactNode
  subtitle?: ReactNode
  date: string
  logo?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {logo && <div className="mt-0.5 shrink-0">{logo}</div>}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-sm font-semibold leading-snug">{title}</h3>
        {subtitle && (
          <div className="text-muted-foreground mt-0.5 text-xs leading-5">{subtitle}</div>
        )}
      </div>
      <div className="text-muted-foreground shrink-0 pt-0.5 text-right font-mono text-[11px] uppercase tracking-wider">
        {date}
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-foreground font-heading text-lg font-semibold tracking-tight">
      {children}
    </h2>
  )
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, email, x, linkedin, github } = content
  const talks = getTalksSortedByDate()

  return (
    <>
      <div className="flex flex-col gap-2 pb-8 pt-6 md:gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/">Home</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>About</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[12rem_minmax(0,1fr)] xl:items-start xl:gap-x-12">
        <div className="flex flex-col items-center gap-4 xl:sticky xl:top-24">
          {avatar && (
            <Image
              src={avatar}
              alt={name}
              width={160}
              height={160}
              className="size-32 object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            />
          )}
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-heading text-xl font-semibold tracking-tight">{name}</h1>
            {occupation && <p className="text-muted-foreground text-sm">{occupation}</p>}
          </div>
          <div className="text-muted-foreground flex gap-2.5">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} />
            <SocialIcon kind="x" href={x} />
          </div>
          <div className="w-full pt-2">
            <Spotify compact />
          </div>
          <div className="flex w-full gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <a
                href={`${process.env.BASE_PATH || ''}/api/resume`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </Button>
            <Button asChild variant="default" size="sm" className="min-w-0 flex-1">
              <NextLink href="/meeting">Book a meeting</NextLink>
            </Button>
          </div>
        </div>

        <div className="xl:pl-2">
          <div className="flex flex-col gap-10">
            <section>
              <SectionHeading>Bio</SectionHeading>
              <div className="typeset typeset-docs mt-3">{children}</div>
            </section>

            <section>
              <SectionHeading>Experience</SectionHeading>
              <div className="divide-border/60 mt-4 divide-y">
                <TimelineItem
                  date="May 2026 - Present"
                  title="Founder"
                  subtitle={
                    <a
                      href="https://www.getspektro.com/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Spektro Inc.
                    </a>
                  }
                  logo={
                    <Image
                      src="/static/images/spektro.svg"
                      alt="Spektro"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="Sept 2025 - Present"
                  title="Graduate Research Assistant"
                  subtitle={
                    <a
                      href="https://www.utsa.edu/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Texas at San Antonio
                    </a>
                  }
                  logo={
                    <Image
                      src="/static/images/UTSanAntonio.svg"
                      alt="UTSA"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="Jan 2023 - Apr 2025"
                  title="Cloud Solution Engineer"
                  subtitle={
                    <a
                      href="https://viettel.com.vn/en/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Viettel Group
                    </a>
                  }
                  logo={
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                      alt="Viettel"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="Aug 2022 - Dec 2022"
                  title="Software Engineer"
                  subtitle={
                    <a
                      href="https://viettel.com.vn/en/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Viettel Group
                    </a>
                  }
                  logo={
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                      alt="Viettel"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
              </div>
            </section>

            <section>
              <SectionHeading>Education</SectionHeading>
              <div className="divide-border/60 mt-4 divide-y">
                <TimelineItem
                  date="Aug 2025 - Present"
                  title="M.S. in Computer Engineering"
                  subtitle={
                    <a
                      href="https://www.utsa.edu/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Texas at San Antonio
                    </a>
                  }
                  logo={
                    <Image
                      src="/static/images/UTSanAntonio.svg"
                      alt="UTSA"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="Aug 2025 - Present"
                  title="Graduate Certificate in Cloud Computing"
                  subtitle={
                    <a
                      href="https://www.utsa.edu/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Texas at San Antonio
                    </a>
                  }
                  logo={
                    <Image
                      src="/static/images/UTSanAntonio.svg"
                      alt="UTSA"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="Oct 2020 - Dec 2024"
                  title="Engineer in Information Technology"
                  subtitle={
                    <>
                      Honors Program
                      <br />
                      <a
                        href="https://uet.vnu.edu.vn"
                        className="hover:text-foreground text-muted-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        VNU University of Engineering and Technology
                      </a>
                    </>
                  }
                  logo={
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/vi/b/bf/Logo_HUET.svg"
                      alt="UET"
                      width={28}
                      height={28}
                      className="size-7 object-contain"
                      unoptimized
                    />
                  }
                />
              </div>
            </section>

            {talks.length > 0 && (
              <section>
                <SectionHeading>Talks</SectionHeading>
                <div className="divide-border/60 mt-4 divide-y">
                  {talks.slice(0, 3).map((talk: TalkMeta) => (
                    <TimelineItem
                      key={talk.event}
                      date={formatDate(talk.date, siteMetadata.locale)}
                      title={
                        talk.url ? (
                          <a
                            href={talk.url}
                            className="text-foreground hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {talk.event}
                          </a>
                        ) : (
                          talk.event
                        )
                      }
                    />
                  ))}
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <NextLink href="/talks">View all talks</NextLink>
                </Button>
              </section>
            )}

            <section>
              <SectionHeading>Awards</SectionHeading>
              <div className="divide-border/60 mt-4 divide-y">
                <TimelineItem
                  date="2026 - 2027"
                  title="Graduate Competitive Scholarship"
                  subtitle="College of AI, Cyber and Computing"
                  logo={
                    <Image
                      src="/static/images/UTSanAntonio.svg"
                      alt="UTSA"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="2025"
                  title="ECE Pioneering Competitive Scholarship"
                  subtitle={
                    <a
                      href="https://www.utsa.edu/"
                      className="hover:text-foreground text-muted-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The University of Texas at San Antonio
                    </a>
                  }
                  logo={
                    <Image
                      src="/static/images/UTSanAntonio.svg"
                      alt="UTSA"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
                <TimelineItem
                  date="2023"
                  title={
                    <a
                      href="https://jobs.viettel.vn/content/Viettel-Digital-Talent/?locale=en_US"
                      className="text-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Viettel Digital Talent
                    </a>
                  }
                  subtitle="Talent Engineer in Cloud Computing"
                  logo={
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                      alt="Viettel"
                      width={28}
                      height={28}
                      className="size-7"
                      unoptimized
                    />
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
