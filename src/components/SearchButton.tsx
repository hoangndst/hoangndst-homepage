'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Skeleton } from '@/components/ui/skeleton'
import siteMetadata from '@/data/siteMetadata'

type SearchDocument = {
  title: string
  slug: string
  summary?: string
  tags?: string[]
  content?: string
}

const resolveSearchDocumentPath = () => {
  const configPath = siteMetadata.search?.localConfig?.searchDocumentsPath
  if (!configPath || typeof configPath !== 'string') {
    return '/generated/search.json'
  }
  return configPath.startsWith('/') ? configPath : `/${configPath}`
}

const SearchButton = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<SearchDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])

  useEffect(() => {
    if (!isOpen || documents.length > 0) {
      return
    }

    let ignore = false
    const controller = new AbortController()
    const searchDocumentPath = resolveSearchDocumentPath()

    const loadDocuments = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const response = await fetch(searchDocumentPath, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Search index request failed with status ${response.status}`)
        }
        const payload = (await response.json()) as
          | SearchDocument[]
          | { documents?: SearchDocument[] }
        const normalizedPayload = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.documents)
            ? payload.documents
            : []

        if (!ignore) {
          setDocuments(normalizedPayload)
        }
      } catch {
        if (!ignore && !controller.signal.aborted) {
          setErrorMessage('Could not load search index.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadDocuments()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [documents.length, isOpen])

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return documents.slice(0, 20)
    }

    const terms = normalizedQuery.split(/\s+/).filter(Boolean)

    return documents
      .map((document) => {
        const title = document.title.toLowerCase()
        const summary = (document.summary ?? '').toLowerCase()
        const tags = (document.tags ?? []).join(' ').toLowerCase()
        const content = (document.content ?? '').toLowerCase()
        const haystack = `${title} ${summary} ${tags} ${content}`
        const score =
          (title.includes(normalizedQuery) ? 8 : 0) +
          (summary.includes(normalizedQuery) ? 5 : 0) +
          (tags.includes(normalizedQuery) ? 4 : 0) +
          (content.includes(normalizedQuery) ? 1 : 0)

        return {
          document,
          matches: terms.every((term) => haystack.includes(term)),
          score,
        }
      })
      .filter((result) => result.matches)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.document)
      .slice(0, 20)
  }, [documents, query])

  const onSelectDocument = (slug: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/blog/${slug}`)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Open search dialog"
        className="gap-1.5"
      >
        <MagnifyingGlassIcon />
        <span className="hidden sm:inline">Search</span>
        <span className="text-muted-foreground hidden text-xs md:inline">⌘K</span>
      </Button>

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Search posts"
        description="Search blog posts by title, summary, tags, or content."
        className="border-border/70 bg-popover top-[12%] translate-y-0 p-0 shadow-xl ring-1 ring-foreground/10 sm:max-w-2xl"
      >
        <Command shouldFilter={false} className="rounded-none">
          <div className="border-border/70 flex items-center justify-between border-b px-4 py-3">
            <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-[0.16em]">
              Search
            </span>
            <kbd className="text-muted-foreground border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
          </div>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search posts and notes"
            autoFocus
          />
          <CommandList className="max-h-[min(26rem,calc(100vh-15rem))] p-1">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-2">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-14 w-full" />
                ))}
              </div>
            ) : null}
            {errorMessage ? <CommandEmpty className="text-destructive">{errorMessage}</CommandEmpty> : null}
            {!isLoading && !errorMessage ? (
              <>
                <CommandEmpty>
                  {query ? `No posts found for “${query}”` : 'Start typing to search posts'}
                </CommandEmpty>
                <CommandGroup heading={query ? 'Matching posts' : 'Recent posts'}>
                  {filteredDocuments.map((document, index) => (
                    <CommandItem
                      key={document.slug}
                      value={document.slug}
                      onSelect={() => onSelectDocument(document.slug)}
                      className="items-start gap-3 px-3 py-3.5"
                    >
                      <span className="text-muted-foreground w-6 shrink-0 pt-0.5 font-mono text-[10px] tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-foreground block truncate text-sm font-medium">
                          {document.title}
                        </span>
                        {document.summary ? (
                          <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                            {document.summary}
                          </span>
                        ) : null}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default SearchButton
