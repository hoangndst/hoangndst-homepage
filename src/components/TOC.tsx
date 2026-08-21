'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import type { TocItem } from '@/lib/content'
import { cn } from '@/lib/utils'

export interface TOCInlineProps {
  toc: TocItem[]
  fromHeading?: number
  toHeading?: number
  exclude?: string | string[]
}

type TocGroup = {
  section: TocItem
  subsections: TocItem[]
}

const TOC = ({
  toc,
  fromHeading = 2,
  toHeading = 3,
  exclude = '',
}: TOCInlineProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )
  const groupedToc = filteredToc.reduce<TocGroup[]>((groups, item) => {
    if (item.depth === fromHeading || groups.length === 0) {
      groups.push({ section: item, subsections: [] })
    } else {
      groups[groups.length - 1].subsections.push(item)
    }
    return groups
  }, [])

  useEffect(() => {
    const details = detailsRef.current
    if (!details) return

    details.open = window.matchMedia('(min-width: 640px)').matches
  }, [])

  useEffect(() => {
    const headings = [...document.querySelectorAll('article h2, article h3')] as HTMLElement[]
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -68% 0px', threshold: [0, 1] }
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [])

  if (filteredToc.length === 0) return null

  return (
    <details ref={detailsRef} className="group col-start-2 mb-3">
      <summary className="text-muted-foreground hover:text-foreground flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] transition-colors [&::-webkit-details-marker]:hidden">
        <span>On this page</span>
        <CaretDownIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
          weight="bold"
        />
      </summary>
      <nav aria-label="Table of contents" className="px-1 py-3">
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {groupedToc.map(({ section, subsections }, index) => {
            const sectionNumber = String(index + 1).padStart(2, '0')
            const isSectionActive = activeId === section.url.slice(1)
            return (
              <li key={section.url} className="min-w-0">
                <a
                  href={section.url}
                  aria-current={isSectionActive ? 'location' : undefined}
                  className={cn(
                    'flex min-w-0 items-baseline gap-2 border-l border-transparent px-2 py-1.5 text-xs leading-snug transition-colors duration-150',
                    isSectionActive
                      ? 'border-foreground font-medium text-foreground'
                      : 'text-muted-foreground hover:border-border hover:text-foreground'
                  )}
                >
                  <span className="text-muted-foreground/60 shrink-0 font-mono text-[10px] tabular-nums">
                    {sectionNumber}
                  </span>
                  <span className="min-w-0 break-words">{section.value}</span>
                </a>
                {subsections.length > 0 && (
                  <ul className="ml-2 mt-0.5 border-l border-border/50 pl-2">
                    {subsections.map((item, subsectionIndex) => {
                      const isActive = activeId === item.url.slice(1)
                      const subsectionNumber = `${sectionNumber}.${String(subsectionIndex + 1).padStart(2, '0')}`
                      return (
                        <li key={item.url}>
                          <a
                            href={item.url}
                            aria-current={isActive ? 'location' : undefined}
                            className={cn(
                              'flex min-w-0 items-baseline gap-2 border-l border-transparent px-2 py-1 text-xs leading-snug transition-colors duration-150',
                              isActive
                                ? 'border-foreground text-foreground'
                                : 'text-muted-foreground hover:border-border hover:text-foreground'
                            )}
                          >
                            <span className="text-muted-foreground/60 shrink-0 font-mono text-[9px] tabular-nums">
                              {subsectionNumber}
                            </span>
                            <span className="min-w-0 break-words">{item.value}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      <div aria-hidden="true" className="border-b border-border" />
    </details>
  )
}

export default TOC
