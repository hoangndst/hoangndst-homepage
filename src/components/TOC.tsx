'use client'
import type { TocItem } from '@/lib/content'
import { useEffect, useState } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TOCInlineProps {
  toc: TocItem[]
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
}

export interface NestedTocItem extends TocItem {
  children?: NestedTocItem[]
}

const createNestedList = (items: TocItem[]): NestedTocItem[] => {
  const nestedList: NestedTocItem[] = []
  const stack: NestedTocItem[] = []

  items.forEach((item) => {
    const newItem: NestedTocItem = { ...item }

    while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
      stack.pop()
    }

    const parent = stack.length > 0 ? stack[stack.length - 1] : null

    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }

    stack.push(newItem)
  })

  return nestedList
}

const TOC = ({
  toc,
  fromHeading = 1,
  toHeading = 6,
  exclude = '',
  ulClassName = 'mt-1 flex flex-col gap-y-0.5',
  liClassName = 'text-xs leading-5',
}: TOCInlineProps) => {
  const [activeId, setActiveId] = useState<string>('')

  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        root: null,
        rootMargin: '0% 0% -80% 0%',
        threshold: [0, 1],
      }
    )

    // Observe all headings in the article
    const headings = document.querySelectorAll(
      'article h1, article h2, article h3, article h4, article h5, article h6'
    )
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [])

  const createList = (items: NestedTocItem[] | undefined) => {
    if (!items || items.length === 0) {
      return null
    }

    return (
      <ul className={ulClassName}>
        {items.map((item) => {
          const isActive = activeId === item.url.slice(1) // Remove the # from the URL
          return (
            <li key={item.url} className={liClassName}>
              <a
                href={item.url}
                className={`block px-2.5 py-1 transition-[color,background-color] duration-150 ease-out ${
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.value}
              </a>
              {item.children && item.children.length > 0 && (
                <div className="ml-2.5 pl-1.5">{createList(item.children)}</div>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  const nestedList = createNestedList(filteredToc)

  return (
    <>
      {toc && toc.length > 0 && (
        <>
          <nav className="sticky top-[9.5rem] col-start-1 hidden self-start text-xs leading-4 xl:block">
            <div className="flex justify-end">
              <ScrollArea
                className="bg-card/60 max-h-[calc(100vh-14.5rem)] w-[320px] max-w-[320px] px-4 py-3"
                type="always"
              >
                <h2 className="text-muted-foreground mb-1.5 pl-1 font-mono text-[11px] font-medium uppercase tracking-wider">
                  Table of Contents
                </h2>
                {createList(nestedList)}
              </ScrollArea>
            </div>
          </nav>
          <details
            open={true}
            className="bg-card/60 group col-start-2 mx-4 block p-4 xl:hidden"
          >
            <summary className="text-foreground flex cursor-pointer items-center justify-between pl-1 text-xs font-semibold uppercase tracking-wide group-open:pb-3">
              Table of Contents
              <CaretDownIcon className="text-muted-foreground size-4 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ScrollArea className="flex max-h-64 flex-col overflow-y-auto pr-1" type="always">
              <nav>{createList(nestedList)}</nav>
            </ScrollArea>
          </details>
        </>
      )}
    </>
  )
}

export default TOC
