'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdjacentPost = {
  path: string
  title: string
}

export default function PostNavigationButton({
  direction,
  post,
}: {
  direction: 'next' | 'prev'
  post?: AdjacentPost
}) {
  const isNext = direction === 'next'
  const label = isNext ? 'Next post' : 'Previous post'
  const fallbackTitle = isNext ? 'Latest post' : 'Last post'
  const title = post?.title ?? fallbackTitle
  const href = post?.path ? `/${post.path}` : undefined

  const labelMarkup = (
    <span
      className={cn(
        'text-muted-foreground font-mono text-[10px] uppercase tracking-wider',
        isNext ? 'text-left' : 'text-right'
      )}
    >
      {label}
    </span>
  )

  const titleMarkup = (
    <span
      className={cn(
        'min-w-0 truncate font-medium',
        isNext ? 'text-left' : 'text-right'
      )}
    >
      {title}
    </span>
  )

  const arrowMarkup = isNext ? (
    <CaretLeftIcon
      aria-hidden="true"
      className={cn(
        'text-muted-foreground shrink-0',
        href && 'group-hover:-translate-x-0.5 transition-transform'
      )}
      size={20}
      weight="bold"
    />
  ) : (
    <CaretRightIcon
      aria-hidden="true"
      className={cn(
        'text-muted-foreground shrink-0',
        href && 'group-hover:translate-x-0.5 transition-transform'
      )}
      size={20}
      weight="bold"
    />
  )

  const content = (
    <>
      {isNext && arrowMarkup}
      <span className="flex min-w-0 flex-col overflow-hidden">
        {labelMarkup}
        {titleMarkup}
      </span>
      {!isNext && arrowMarkup}
    </>
  )

  const alignment = isNext ? 'justify-start' : 'justify-end'

  if (!href) {
    return (
      <Button
        type="button"
        variant="ghost"
        disabled
        size="lg"
        className={cn('h-auto w-full gap-3 py-3 sm:w-1/2', alignment)}
      >
        {content}
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={cn('group h-auto w-full gap-3 py-3 sm:w-1/2', alignment)}
    >
      <NextLink href={href} aria-label={`${label}: ${title}`}>
        {content}
      </NextLink>
    </Button>
  )
}