'use client'

import { type ReactElement, useEffect, useState } from 'react'
import Link from '@/components/Link'
import Youtube from '@/components/Youtube'
import type { NoteBlock, NotionNotePayload, NoteTextSpan, NotionOption } from '@/lib/notion'

type ApiResponse = {
  note?: NotionNotePayload
  error?: string
}

const textClassByAnnotation = (span: NoteTextSpan) => {
  const classes: string[] = []
  if (span.annotations.bold) classes.push('font-semibold')
  if (span.annotations.italic) classes.push('italic')
  if (span.annotations.strikethrough) classes.push('line-through')
  if (span.annotations.underline) classes.push('underline')
  if (span.annotations.code) classes.push('bg-muted px-1.5 py-0.5 font-mono text-[0.9em]')
  if (span.annotations.color.includes('red')) classes.push('text-foreground')
  if (span.annotations.color.includes('orange')) classes.push('text-foreground')
  if (span.annotations.color.includes('yellow')) classes.push('text-foreground')
  if (span.annotations.color.includes('green')) classes.push('text-foreground')
  if (span.annotations.color.includes('blue')) classes.push('text-foreground')
  if (span.annotations.color.includes('purple')) classes.push('text-foreground')
  if (span.annotations.color.includes('pink')) classes.push('text-foreground')
  if (span.annotations.color.includes('gray') || span.annotations.color.includes('brown'))
    classes.push('text-muted-foreground')
  return classes.join(' ')
}

const RichText = ({ spans }: { spans: NoteTextSpan[] }) => {
  if (spans.length === 0) return null
  return (
    <>
      {spans.map((span, index) =>
        span.href ? (
          <Link
            key={`${span.text}-${index}`}
            href={span.href}
            className={`text-foreground break-all [overflow-wrap:anywhere] hover:underline ${textClassByAnnotation(span)}`}
          >
            {span.text}
          </Link>
        ) : (
          <span key={`${span.text}-${index}`} className={textClassByAnnotation(span)}>
            {span.text}
          </span>
        )
      )}
    </>
  )
}

const badgeClass = (color: string) => {
  switch (color) {
    case 'blue':
    case 'green':
    case 'yellow':
    case 'orange':
    case 'red':
    case 'purple':
      return 'bg-muted text-foreground'
    default:
      return 'bg-muted text-foreground'
  }
}

const OptionBadge = ({ option }: { option: NotionOption | null }) =>
  option ? (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium ${badgeClass(option.color)}`}
    >
      {option.name}
    </span>
  ) : null

const isYoutubeUrl = (rawUrl: string) => {
  try {
    const { hostname } = new URL(rawUrl)
    return hostname.includes('youtube.com') || hostname.includes('youtu.be')
  } catch {
    return false
  }
}

const normalizePossibleUrl = (value: string) => {
  const trimmed = value.trim().replace(/[),.;!?]+$/g, '')
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (
    trimmed.startsWith('www.') ||
    trimmed.startsWith('youtu.be/') ||
    trimmed.startsWith('youtube.com/')
  ) {
    return `https://${trimmed.replace(/^https?:\/\//, '')}`
  }
  return ''
}

const collectUrlsFromRichText = (spans: NoteTextSpan[]) => {
  const direct = spans
    .map((span) => normalizePossibleUrl(span.href || span.text || ''))
    .filter(Boolean)

  const fromText = spans.flatMap((span) => {
    const matches = span.text.match(/((https?:\/\/|www\.)[^\s<>"']+)/gi) || []
    return matches.map((m) => normalizePossibleUrl(m)).filter(Boolean)
  })

  return [...new Set([...direct, ...fromText])]
}

const extractYoutubeUrlFromBlock = (block: NoteBlock) => {
  const candidates = [
    normalizePossibleUrl(block.url || ''),
    ...collectUrlsFromRichText(block.richText),
  ].filter(Boolean)

  const youtube = candidates.find((candidate) => isYoutubeUrl(candidate))
  if (!youtube) return null

  try {
    return new URL(youtube).toString()
  } catch {
    return null
  }
}

const BlockRenderer = ({ block }: { block: NoteBlock }) => {
  switch (block.type) {
    case 'heading_1':
      return (
        <h1 className="text-foreground font-heading mt-7 text-2xl font-bold tracking-tight">
          <RichText spans={block.richText} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2 className="text-foreground font-heading mt-6 text-xl font-bold tracking-tight">
          <RichText spans={block.richText} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3 className="text-foreground font-heading mt-5 text-lg font-semibold">
          <RichText spans={block.richText} />
        </h3>
      )
    case 'quote':
      return (
        <blockquote className="text-muted-foreground border-border my-4 border-l-4 pl-4">
          <RichText spans={block.richText} />
        </blockquote>
      )
    case 'code':
      return (
        <pre className="bg-muted text-foreground border-border my-4 overflow-x-auto border p-4 text-sm">
          <code>
            <RichText spans={block.richText} />
          </code>
        </pre>
      )
    case 'to_do':
      return (
        <div className="text-muted-foreground flex items-start gap-2 leading-7">
          <input
            type="checkbox"
            checked={Boolean(block.checked)}
            readOnly
            className="mt-1 h-4 w-4"
          />
          <div>
            <RichText spans={block.richText} />
          </div>
        </div>
      )
    case 'callout':
      return (
        <div className="text-muted-foreground bg-muted border-border flex items-start gap-2 border px-3 py-2">
          <span>{block.icon?.value || '💡'}</span>
          <div>
            <RichText spans={block.richText} />
          </div>
        </div>
      )
    case 'toggle':
      return (
        <details className="border-border border px-3 py-2">
          <summary className="text-foreground cursor-pointer font-medium">
            <RichText spans={block.richText} />
          </summary>
          {block.children && block.children.length > 0 && (
            <div className="mt-2 flex flex-col gap-3">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </div>
          )}
        </details>
      )
    case 'divider':
      return <hr className="border-border my-4" />
    case 'image':
      return (
        <figure className="my-4">
          {block.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.imageUrl}
              alt={block.imageCaption?.map((item) => item.text).join('') || 'Notion image'}
              className="w-full"
            />
          ) : null}
          {block.imageCaption && block.imageCaption.length > 0 ? (
            <figcaption className="text-muted-foreground mt-2 text-sm">
              <RichText spans={block.imageCaption} />
            </figcaption>
          ) : null}
        </figure>
      )
    case 'bookmark':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground bg-muted block break-all p-3 text-sm [overflow-wrap:anywhere] hover:underline"
        >
          {block.url}
        </a>
      ) : null
    case 'link_preview':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground bg-muted block break-all p-3 text-sm [overflow-wrap:anywhere] hover:underline"
        >
          {block.url}
        </a>
      ) : null
    case 'embed':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return block.url ? (
        <div className="my-4 overflow-hidden">
          <iframe
            src={block.url}
            className="h-[420px] w-full"
            loading="lazy"
            title="Embedded content"
          />
        </div>
      ) : null
    case 'video': {
      const youtubeUrl = extractYoutubeUrlFromBlock(block)
      return block.url ? (
        <div className="my-4 overflow-hidden">
          {youtubeUrl ? (
            <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
          ) : (
            <video controls src={block.url} className="w-full">
              <track kind="captions" />
            </video>
          )}
        </div>
      ) : null
    }
    case 'audio':
      return block.url ? (
        <audio controls src={block.url} className="my-4 w-full">
          <track kind="captions" />
        </audio>
      ) : null
    case 'file':
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground bg-muted inline-flex max-w-full break-all px-3 py-2 text-sm [overflow-wrap:anywhere] hover:underline"
        >
          {block.fileName || 'Download file'}
        </a>
      ) : null
    case 'pdf':
      return block.url ? (
        <div className="my-4 overflow-hidden">
          <iframe src={block.url} className="h-[620px] w-full" loading="lazy" title="PDF preview" />
        </div>
      ) : null
    case 'equation':
      return (
        <pre className="bg-muted border-border my-4 overflow-x-auto border p-3 text-sm">
          {block.equation || block.richText.map((s) => s.text).join('')}
        </pre>
      )
    case 'bulleted_list_item':
      return (
        <li className="text-muted-foreground leading-7">
          <RichText spans={block.richText} />
          {block.children && block.children.length > 0 && (
            <ul className="ml-5 flex list-disc flex-col gap-1 pt-1">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ul>
          )}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li className="text-muted-foreground leading-7">
          <RichText spans={block.richText} />
          {block.children && block.children.length > 0 && (
            <ol className="ml-5 flex list-decimal flex-col gap-1 pt-1">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ol>
          )}
        </li>
      )
    case 'paragraph':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return (
        <p className="text-muted-foreground leading-7">
          <RichText spans={block.richText} />
        </p>
      )
    default:
      return null
  }
}

const renderBlocks = (blocks: NoteBlock[]) => {
  const elements: ReactElement[] = []
  let index = 0
  while (index < blocks.length) {
    const block = blocks[index]
    if (block.type === 'bulleted_list_item') {
      const listItems: NoteBlock[] = []
      while (index < blocks.length && blocks[index].type === 'bulleted_list_item')
        listItems.push(blocks[index++])
      elements.push(
        <ul key={`bullet-${listItems[0].id}`} className="ml-5 flex list-disc flex-col gap-1">
          {listItems.map((item) => (
            <BlockRenderer key={item.id} block={item} />
          ))}
        </ul>
      )
      continue
    }
    if (block.type === 'numbered_list_item') {
      const listItems: NoteBlock[] = []
      while (index < blocks.length && blocks[index].type === 'numbered_list_item')
        listItems.push(blocks[index++])
      elements.push(
        <ol key={`number-${listItems[0].id}`} className="ml-5 flex list-decimal flex-col gap-1">
          {listItems.map((item) => (
            <BlockRenderer key={item.id} block={item} />
          ))}
        </ol>
      )
      continue
    }
    elements.push(<BlockRenderer key={block.id} block={block} />)
    index += 1
  }
  return elements
}

type NoteContentProps = {
  pageId: string
  /** e.g. `/api/notes` or `/api/cooking` */
  apiBasePath?: string
}

export default function NoteContent({ pageId, apiBasePath = '/api/notes' }: NoteContentProps) {
  const [note, setNote] = useState<NotionNotePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${apiBasePath}/${pageId}`)
        const data = (await response.json()) as ApiResponse
        if (!response.ok) return setError(data.error || 'Unable to load note from Notion.')
        if (!data.note) return setError('No note content available.')
        setNote(data.note)
      } catch (err) {
        setError('Network error while fetching note.')
        console.error('Failed to fetch note:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNote()
  }, [pageId, apiBasePath])

  if (isLoading)
    return (
      <div className="bg-card p-5">
        <div className="flex animate-pulse flex-col gap-3">
<div className="bg-muted h-7 w-1/2" />
        <div className="bg-muted h-4 w-full" />
        <div className="bg-muted h-4 w-11/12" />
        </div>
      </div>
    )
  if (error)
    return <div className="bg-destructive/10 text-destructive p-5 text-sm">{error}</div>
  if (!note)
    return (
      <div className="text-muted-foreground bg-muted p-5 text-sm">No note found.</div>
    )

  return (
    <article className="bg-card p-5 sm:p-6">
      <header className="mb-5 pb-4">
        <h1 className="text-foreground font-heading inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <span>{note.icon.type === 'emoji' && note.icon.value ? note.icon.value : '📝'}</span>
          <span>{note.title}</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-xs">
          Last updated: {new Date(note.lastEditedTime).toLocaleString()}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {note.topic.map((t) => (
            <span
              key={`${t.name}-${t.color}`}
              className={`inline-flex px-2 py-0.5 text-xs font-medium ${badgeClass(t.color)}`}
            >
              {t.name}
            </span>
          ))}
          <OptionBadge option={note.status} />
          <OptionBadge option={note.priority} />
        </div>
      </header>
      <div className="flex flex-col gap-4">{renderBlocks(note.blocks)}</div>
    </article>
  )
}
