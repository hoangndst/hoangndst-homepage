'use client'

import { Fragment, type ComponentProps, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  MessageSquare,
  Tags,
  User,
} from 'lucide-react'
import Link from '@/components/Link'

const cx = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ')

export function Breadcrumb({ className, ...props }: ComponentProps<'nav'>) {
  return <nav aria-label="Breadcrumb" className={className} {...props} />
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cx(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 dark:text-gray-400 sm:gap-2',
        className
      )}
      {...props}
    />
  )
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cx('inline-flex items-center gap-1.5', className)} {...props} />
}

export function BreadcrumbLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(
        'inline-flex items-center rounded-sm px-1 py-0.5 transition-colors hover:text-primary-500 dark:hover:text-primary-400',
        className
      )}
      {...props}
    />
  )
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cx(
        'inline-flex items-center rounded-sm px-1 py-0.5 font-medium text-gray-700 dark:text-gray-200',
        className
      )}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<'li'> & { children?: ReactNode }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cx('text-gray-400 dark:text-gray-500 [&>svg]:h-3.5 [&>svg]:w-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

export interface BreadcrumbEntry {
  href?: string
  label: string
  icon?: ReactNode
}

interface SimpleBreadcrumbProps {
  items?: BreadcrumbEntry[]
}

const formatSegmentLabel = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const iconBySegment = (segment: string, index: number, allSegments: string[]): ReactNode => {
  const rootSegment = allSegments[0]

  if (index > 0 && rootSegment === 'blog' && segment !== 'page') {
    return <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
  }

  if (index > 0 && rootSegment === 'tags') {
    return <Tags className="h-4 w-4 shrink-0" aria-hidden="true" />
  }

  switch (segment) {
    case 'about':
      return <User className="h-4 w-4 shrink-0" aria-hidden="true" />
    case 'blog':
      return <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
    case 'projects':
      return <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
    case 'tags':
      return <Tags className="h-4 w-4 shrink-0" aria-hidden="true" />
    case 'talks':
      return <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
    case 'documents':
      return <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
    default:
      return <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
  }
}

const buildItemsFromPath = (pathname: string): BreadcrumbEntry[] => {
  const rawSegments = pathname.split('/').filter(Boolean)
  const builtItems: BreadcrumbEntry[] = []
  let hrefAccumulator = ''

  for (let i = 0; i < rawSegments.length; i += 1) {
    const segment = rawSegments[i]

    if (segment === 'page' && rawSegments[i + 1]) {
      const pageNumber = rawSegments[i + 1]
      hrefAccumulator += `/page/${pageNumber}`
      builtItems.push({
        href: hrefAccumulator,
        label: `Page ${pageNumber}`,
        icon: <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />,
      })
      i += 1
      continue
    }

    hrefAccumulator += `/${segment}`
    builtItems.push({
      href: hrefAccumulator,
      label: formatSegmentLabel(segment),
      icon: iconBySegment(segment, i, rawSegments),
    })
  }

  return builtItems
}

export default function SimpleBreadcrumb({ items }: SimpleBreadcrumbProps) {
  const pathname = usePathname() || '/'
  const normalizedItems = items ?? buildItemsFromPath(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" aria-label="Go to home">
            <Home className="h-4 w-4" aria-hidden="true" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {normalizedItems.map((item, index) => {
          const isLast = index === normalizedItems.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    <span className="flex items-center gap-x-2">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || '#'}>
                    <span className="flex items-center gap-x-2">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
