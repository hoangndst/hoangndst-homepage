'use client'

import {
  CheckIcon,
  CopyIcon,
  CaretDownIcon,
  CursorIcon,
  GlobeIcon,
  LinkIcon,
  MarkdownLogoIcon,
  OpenAiLogoIcon,
  ShareNetworkIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ShareMenuProps = {
  title: string
  url: string
  rawUrl: string
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export default function ShareMenu({ title, url, rawUrl }: ShareMenuProps) {
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        menuRef.current?.removeAttribute('open')
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        menuRef.current?.removeAttribute('open')
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const markCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const copyLink = async () => {
    try {
      await copyText(url)
      markCopied()
    } catch {
      setCopied(false)
    }
  }

  const copyPage = async () => {
    try {
      const response = await fetch(rawUrl)
      if (!response.ok) throw new Error('Unable to fetch Markdown')
      await copyText(await response.text())
      markCopied()
    } catch {
      setCopied(false)
    }
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {})
      return
    }
    await copyLink()
  }

  const closeMenu = (event: SyntheticEvent<HTMLElement>) => {
    event.currentTarget.closest('details')?.removeAttribute('open')
  }

  const aiPrompt = `Read ${url}, I want to ask questions about it.`

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        <Button
          className="gap-1.5"
          onClick={() => void copyPage()}
          size="sm"
          type="button"
          variant="outline"
        >
          {copied ? <CheckIcon weight="bold" /> : <CopyIcon />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy page'}</span>
        </Button>
        <details className="group relative" ref={menuRef}>
          <summary
            aria-label="More article actions"
            className={cn(
              'flex h-7 cursor-pointer list-none items-center border border-l-0 border-border bg-background px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            )}
          >
            <CaretDownIcon aria-hidden="true" className="size-3" weight="bold" />
          </summary>
          <div className="absolute right-0 top-full z-30 mt-2 w-52 border border-border bg-popover p-1 text-popover-foreground shadow-lg">
            <button
              className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={(event) => {
                closeMenu(event)
                void copyLink()
              }}
              type="button"
            >
              <LinkIcon aria-hidden="true" className="size-4" />
              {copied ? 'Copied link' : 'Copy link'}
            </button>
            <a
              className="flex items-center gap-2 px-2.5 py-2 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href={rawUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MarkdownLogoIcon aria-hidden="true" className="size-4" />
              View as Markdown
            </a>
            <div className="my-1 border-t border-border" />
            <a
              className="flex items-center gap-2 px-2.5 py-2 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href={`https://chatgpt.com/?hints=search&q=${encodeURIComponent(aiPrompt)}`}
              rel="noreferrer"
              target="_blank"
            >
              <OpenAiLogoIcon aria-hidden="true" className="size-4" />
              Open in ChatGPT
            </a>
            <a
              className="flex items-center gap-2 px-2.5 py-2 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href={`https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`}
              rel="noreferrer"
              target="_blank"
            >
              <SparkleIcon aria-hidden="true" className="size-4" />
              Open in Claude
            </a>
            <a
              className="flex items-center gap-2 px-2.5 py-2 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href={`https://cursor.com/link/prompt?text=${encodeURIComponent(aiPrompt)}`}
              rel="noreferrer"
              target="_blank"
            >
              <CursorIcon aria-hidden="true" className="size-4" />
              Open in Cursor
            </a>
            <a
              className="flex items-center gap-2 px-2.5 py-2 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              href={`https://grok.com/?q=${encodeURIComponent(aiPrompt)}`}
              rel="noreferrer"
              target="_blank"
            >
              <GlobeIcon aria-hidden="true" className="size-4" />
              Open in Grok
            </a>
          </div>
        </details>
      </div>
      <Button aria-label="Share article" onClick={() => void share()} size="icon-sm" type="button" variant="ghost">
        <ShareNetworkIcon aria-hidden="true" />
      </Button>
    </div>
  )
}
