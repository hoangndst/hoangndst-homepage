'use client'
import { Toc } from 'pliny/mdx-plugins'
import { useEffect, useState } from 'react'
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
  ulClassName = 'flex flex-col justify-end gap-y-2 overflow-y-auto ml-2 xl:ml-4 marker:text-gray-500',
  liClassName = 'list-inside list-disc ml-2 p-y-2 text-sm xl:list-none xl:ml-1 xl:max-w-[280px]',
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
        {items.map((item, index) => {
          const isActive = activeId === item.url.slice(1) // Remove the # from the URL
          return (
            <li key={index} className={liClassName}>
              <a
                href={item.url}
                className={`underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit xl:py-0 ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                }`}
              >
                {item.value}
              </a>
              {createList(item.children)}
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
          <nav className="sticky top-[9.5rem] col-start-1 hidden h-[calc(100vh-9.5rem)] text-sm leading-4 xl:block">
            <div className="flex justify-end">
              <ScrollArea className="max-h-[calc(100vh-14.5rem)]" type="always">
                <h2 className="mb-2 text-lg font-semibold">Table of Contents</h2>
                {createList(nestedList)}
              </ScrollArea>
            </div>
          </nav>
          <details
            open={true}
            className="group col-start-2 mx-4 block rounded-xl border border-gray-800 p-4 dark:border-gray-800 xl:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between text-xl font-semibold group-open:pb-4">
              Table of Contents
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <ScrollArea className="flex max-h-64 flex-col overflow-y-auto" type="always">
              <nav>{createList(nestedList)}</nav>
            </ScrollArea>
          </details>
        </>
      )}
    </>
  )
}

export default TOC
