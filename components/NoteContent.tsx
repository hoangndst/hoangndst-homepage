'use client'

import { useEffect, useState } from 'react'
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
  if (span.annotations.code)
    classes.push('rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-gray-800')
  if (span.annotations.color.includes('red')) classes.push('text-red-600 dark:text-red-400')
  if (span.annotations.color.includes('orange'))
    classes.push('text-orange-600 dark:text-orange-400')
  if (span.annotations.color.includes('yellow'))
    classes.push('text-yellow-700 dark:text-yellow-400')
  if (span.annotations.color.includes('green')) classes.push('text-green-600 dark:text-green-400')
  if (span.annotations.color.includes('blue')) classes.push('text-blue-600 dark:text-blue-400')
  if (span.annotations.color.includes('purple'))
    classes.push('text-purple-600 dark:text-purple-400')
  if (span.annotations.color.includes('pink')) classes.push('text-pink-600 dark:text-pink-400')
  if (span.annotations.color.includes('gray') || span.annotations.color.includes('brown'))
    classes.push('text-gray-600 dark:text-gray-400')
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
            className={`break-all text-primary-600 [overflow-wrap:anywhere] hover:underline dark:text-primary-400 ${textClassByAnnotation(span)}`}
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
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
    case 'green':
      return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
    case 'yellow':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'orange':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
    case 'red':
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    case 'purple':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const OptionBadge = ({ option }: { option: NotionOption | null }) =>
  option ? (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass(option.color)}`}
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
        <h1 className="mt-7 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <RichText spans={block.richText} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <RichText spans={block.richText} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <RichText spans={block.richText} />
        </h3>
      )
    case 'quote':
      return (
        <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <RichText spans={block.richText} />
        </blockquote>
      )
    case 'code':
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <code>
            <RichText spans={block.richText} />
          </code>
        </pre>
      )
    case 'to_do':
      return (
        <div className="flex items-start gap-2 leading-7 text-gray-700 dark:text-gray-300">
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
        <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span>{block.icon?.value || '💡'}</span>
          <div>
            <RichText spans={block.richText} />
          </div>
        </div>
      )
    case 'toggle':
      return (
        <details className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
          <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">
            <RichText spans={block.richText} />
          </summary>
          {block.children && block.children.length > 0 && (
            <div className="mt-2 space-y-3">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </div>
          )}
        </details>
      )
    case 'divider':
      return <hr className="my-4 border-gray-200 dark:border-gray-800" />
    case 'image':
      return (
        <figure className="my-4">
          {block.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.imageUrl}
              alt={block.imageCaption?.map((item) => item.text).join('') || 'Notion image'}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800"
            />
          ) : null}
          {block.imageCaption && block.imageCaption.length > 0 ? (
            <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
            <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
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
          className="block break-all rounded-lg border border-gray-200 p-3 text-sm text-blue-600 [overflow-wrap:anywhere] hover:underline dark:border-gray-800 dark:text-blue-400"
        >
          {block.url}
        </a>
      ) : null
    case 'link_preview':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
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
          className="block break-all rounded-lg border border-gray-200 p-3 text-sm text-blue-600 [overflow-wrap:anywhere] hover:underline dark:border-gray-800 dark:text-blue-400"
        >
          {block.url}
        </a>
      ) : null
    case 'embed':
      {
        const youtubeUrl = extractYoutubeUrlFromBlock(block)
        if (youtubeUrl) {
          return (
            <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return block.url ? (
        <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
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
        <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
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
          className="inline-flex max-w-full break-all rounded-lg border border-gray-200 px-3 py-2 text-sm text-blue-600 [overflow-wrap:anywhere] hover:underline dark:border-gray-800 dark:text-blue-400"
        >
          {block.fileName || 'Download file'}
        </a>
      ) : null
    case 'pdf':
      return block.url ? (
        <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <iframe src={block.url} className="h-[620px] w-full" loading="lazy" title="PDF preview" />
        </div>
      ) : null
    case 'equation':
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-gray-900">
          {block.equation || block.richText.map((s) => s.text).join('')}
        </pre>
      )
    case 'bulleted_list_item':
      return (
        <li className="leading-7 text-gray-700 dark:text-gray-300">
          <RichText spans={block.richText} />
          {block.children && block.children.length > 0 && (
            <ul className="ml-5 list-disc space-y-1 pt-1">
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </ul>
          )}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li className="leading-7 text-gray-700 dark:text-gray-300">
          <RichText spans={block.richText} />
          {block.children && block.children.length > 0 && (
            <ol className="ml-5 list-decimal space-y-1 pt-1">
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
            <div className="my-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <Youtube idOrUrl={youtubeUrl} className="h-full w-full" />
            </div>
          )
        }
      }
      return (
        <p className="leading-7 text-gray-700 dark:text-gray-300">
          <RichText spans={block.richText} />
        </p>
      )
    default:
      return null
  }
}

const renderBlocks = (blocks: NoteBlock[]) => {
  const elements: JSX.Element[] = []
  let index = 0
  while (index < blocks.length) {
    const block = blocks[index]
    if (block.type === 'bulleted_list_item') {
      const listItems: NoteBlock[] = []
      while (index < blocks.length && blocks[index].type === 'bulleted_list_item')
        listItems.push(blocks[index++])
      elements.push(
        <ul key={`bullet-${listItems[0].id}`} className="ml-5 list-disc space-y-1">
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
        <ol key={`number-${listItems[0].id}`} className="ml-5 list-decimal space-y-1">
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

export default function NoteContent({ pageId }: { pageId: string }) {
  const [note, setNote] = useState<NotionNotePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/notes/${pageId}`)
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
  }, [pageId])

  if (isLoading)
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  if (error)
    return (
      <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    )
  if (!note)
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No note found.
      </div>
    )

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-6">
      <header className="mb-5 border-b border-gray-200 pb-4 dark:border-gray-800">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          <span>{note.icon.type === 'emoji' && note.icon.value ? note.icon.value : '📝'}</span>
          <span>{note.title}</span>
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(note.lastEditedTime).toLocaleString()}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {note.topic.map((t) => (
            <span
              key={`${t.name}-${t.color}`}
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass(t.color)}`}
            >
              {t.name}
            </span>
          ))}
          <OptionBadge option={note.status} />
          <OptionBadge option={note.priority} />
        </div>
      </header>
      <div className="space-y-4">{renderBlocks(note.blocks)}</div>
    </article>
  )
}
