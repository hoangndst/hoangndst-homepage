'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState, useRef, useCallback } from 'react'
import { ArrowUpIcon, ChatCircleIcon } from '@phosphor-icons/react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleScrollToComment = useCallback(() => {
    const el = document.getElementById('comment')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none absolute top-0 h-px w-px" aria-hidden="true" />
      <div
        className={`fixed bottom-8 end-6 z-40 flex flex-col gap-2.5 transition-all duration-300 ease-out ${
          show
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {siteMetadata.comments?.provider && (
          <button
            type="button"
            aria-label="Scroll to comments"
            onClick={handleScrollToComment}
            className="bg-background ring-border/20 hover:bg-muted focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-none shadow-sm ring-1 transition-[color,background-color,border-color,box-shadow,translate,scale] duration-150 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 active:scale-[0.96]"
          >
            <ChatCircleIcon className="text-muted-foreground" size={18} weight="bold" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={handleScrollTop}
          className="bg-background ring-border/20 hover:bg-muted focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-none shadow-sm ring-1 transition-[color,background-color,border-color,box-shadow,translate,scale] duration-150 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 active:scale-[0.96]"
        >
          <ArrowUpIcon className="text-muted-foreground" size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

export default ScrollTopAndComment
