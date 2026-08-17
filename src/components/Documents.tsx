'use client'

import { Doc } from '@/data/documentsData'
import { useEffect, useMemo, useState } from 'react'
import {
  CaretLeftIcon,
  CaretRightIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react'
import Link from './Link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const MIN_CONTAINER_HEIGHT = 400
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50]

/**
 * Formats a date string into a human-readable string.
 * @param {string | undefined} dateString - The date string to format.
 * @returns {string} The formatted date, or '-' if undefined, or the original string if invalid.
 * If dateString is undefined, returns '-'. If dateString is invalid, returns the original string.
 */
function formatDate(dateString?: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// Helper to get a generic document icon
function getFileIcon() {
  return <FileTextIcon className="text-muted-foreground size-4" aria-hidden="true" />
}

// Skeleton loader for table
function SkeletonTable({ rows = 10 }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={5} className="h-12">
            <Skeleton className="mx-auto h-4 w-1/3" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={`documents-skeleton-row-${i}`}>
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const Documents = () => {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  // Fetch documents function (used on mount and refresh)
  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/documents`)
      const data = await response.json()
      if (response.ok) {
        const objects = data.objects
        setDocuments(objects)
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  // Reset to first page if rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1)
  }, [rowsPerPage])

  const totalPages = Math.max(1, Math.ceil(documents.length / rowsPerPage))
  const paginatedDocuments = documents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )
  const currentPageDocumentNames = useMemo(
    () => paginatedDocuments.map((document) => document.name),
    [paginatedDocuments]
  )
  const hasAnyOnPageSelected = currentPageDocumentNames.some((name) =>
    selectedDocuments.includes(name)
  )
  const areAllOnPageSelected =
    currentPageDocumentNames.length > 0 &&
    currentPageDocumentNames.every((name) => selectedDocuments.includes(name))
  const totalDocs = documents.length
  const startIdx = totalDocs === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const endIdx = Math.min(currentPage * rowsPerPage, totalDocs)

  const toggleSelectAllOnPage = (checked: boolean | 'indeterminate') => {
    const nextChecked = checked === true

    setSelectedDocuments((previous) => {
      if (!nextChecked) {
        return previous.filter((name) => !currentPageDocumentNames.includes(name))
      }

      const merged = new Set(previous)
      currentPageDocumentNames.forEach((name) => merged.add(name))
      return Array.from(merged)
    })
  }

  const toggleRowSelection = (documentName: string, checked: boolean | 'indeterminate') => {
    const nextChecked = checked === true
    setSelectedDocuments((previous) => {
      if (nextChecked) {
        return previous.includes(documentName) ? previous : [...previous, documentName]
      }

      return previous.filter((name) => name !== documentName)
    })
  }

  return (
    <div
      className="bg-card w-full p-2 sm:p-4"
      style={{ minHeight: MIN_CONTAINER_HEIGHT }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <EnvelopeSimpleIcon className="text-muted-foreground" aria-hidden="true" />
          hoangndst
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => fetchDocuments()}
          disabled={isLoading}
          title="Refresh"
          aria-label="Refresh documents"
        >
          <ArrowsClockwiseIcon
            data-icon="inline-start"
            className={isLoading ? 'animate-spin' : undefined}
            aria-hidden="true"
          />
          Refresh
        </Button>
      </div>
      <div className="w-full">
        {isLoading ? (
          <SkeletonTable rows={rowsPerPage} />
        ) : (
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={areAllOnPageSelected || (hasAnyOnPageSelected && 'indeterminate')}
                    onCheckedChange={toggleSelectAllOnPage}
                    aria-label="Select all documents on current page"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((document) => (
                <TableRow key={document.name}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(document.name)}
                      onCheckedChange={(checked) => toggleRowSelection(document.name, checked)}
                      aria-label={`Select ${document.name}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-[340px]">
                    <div className="flex items-center gap-2">
                      {getFileIcon()}
                      <span className="truncate font-medium">
                        {document.downloadUrl ? (
                          <Link
                            href={document.downloadUrl}
                            aria-label={`Open ${document.name}`}
                            className="focus-visible:ring-ring underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2"
                          >
                            {document.name}
                          </Link>
                        ) : (
                          document.name
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(document.lastModified)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{document.size || '-'}</TableCell>
                  <TableCell className="text-right">
                    {document.downloadUrl ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={document.downloadUrl} aria-label={`Download ${document.name}`}>
                          Download
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">No action</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages >= 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground ml-1" role="status" aria-live="polite">
            {startIdx}-{endIdx} of {totalDocs}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="ml-1"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <CaretLeftIcon aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <CaretRightIcon aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Documents
