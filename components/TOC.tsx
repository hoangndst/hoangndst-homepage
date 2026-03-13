'use client'
import { Toc } from 'pliny/mdx-plugins'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollArea } from './ScrollArea'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export interface TOCInlineProps {
  toc: Toc
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
                className={`block rounded-md px-2.5 py-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                }`}
              >
                {item.value}
              </a>
              {item.children && item.children.length > 0 && (
                <div className="ml-2.5 border-l border-gray-200 pl-1.5 dark:border-gray-700">
                  {createList(item.children)}
                </div>
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
                className="border-input max-h-[calc(100vh-14.5rem)] w-[320px] max-w-[320px] rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
                type="always"
              >
                <h2 className="mb-1.5 pl-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Table of Contents
                </h2>
                {createList(nestedList)}
              </ScrollArea>
            </div>
          </nav>
          <details
            open={true}
            className="border-input group col-start-2 mx-4 block rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-950 xl:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between pl-1 text-xs font-semibold uppercase tracking-wide text-gray-700 group-open:pb-3 dark:text-gray-200">
              Table of Contents
              <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 group-open:rotate-180 dark:text-gray-400" />
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
