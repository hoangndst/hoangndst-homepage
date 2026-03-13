'use client'

import { Doc } from '@/data/documentsData'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Mail, RefreshCw } from 'lucide-react'
import Link from './Link'

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
  return <FileText className="h-5 w-5 text-blue-400" strokeWidth={1.75} />
}

// Skeleton loader for table
function SkeletonTable({ rows = 10 }) {
  return (
    <table className="w-full min-w-[600px] animate-pulse divide-y bg-white text-sm dark:bg-gray-900 sm:text-base">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-3" colSpan={5}>
            <div className="mx-auto h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td className="px-4 py-2">
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Documents = () => {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0])

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
  const totalDocs = documents.length
  const startIdx = totalDocs === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const endIdx = Math.min(currentPage * rowsPerPage, totalDocs)

  return (
    <div
      className={`min-h-[${MIN_CONTAINER_HEIGHT}px] w-full rounded-lg border-2 border-gray-200 border-opacity-60 p-2 dark:border-gray-700 sm:p-4`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Mail className="h-7 w-7 text-blue-500 dark:text-blue-400" strokeWidth={1.75} />
          hoangndst
        </div>
        <button
          className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => fetchDocuments()}
          disabled={isLoading}
          title="Refresh"
          aria-label="Refresh documents"
        >
          <RefreshCw className="h-5 w-5" strokeWidth={1.75} />
          Refresh
        </button>
      </div>
      <div className="w-full max-w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <SkeletonTable rows={rowsPerPage} />
        ) : (
          <table className="w-full min-w-[600px] divide-y divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900 sm:text-base">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 border-gray-300 bg-white text-blue-500 dark:border-gray-600 dark:bg-gray-900"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {paginatedDocuments.map((d, idx) => (
                <tr
                  key={d.name}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 border-gray-300 bg-white text-blue-500 dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td className="flex items-center gap-2 px-4 py-2">
                    {getFileIcon()}
                    <span className="max-w-xs truncate font-medium">
                      {d.downloadUrl ? (
                        <Link href={d.downloadUrl} aria-label={`Link to ${d.downloadUrl}`}>
                          {d.name}
                        </Link>
                      ) : (
                        d.name
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(d.lastModified)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {d.size ? d.size : '-'}
                  </td>
                  <td className="flex gap-2 px-4 py-2">
                    {d.downloadUrl && (
                      <Link
                        href={d.downloadUrl}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        aria-label={`Download ${d.name}`}
                      >
                        Download
                      </Link>
                    )}
                    {/* Add more actions here if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2 text-sm">
            <span>Rows per page:</span>
            <select
              className=" rounded border border-gray-300 bg-white px-2 py-1 pr-8 text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {startIdx}–{endIdx} of {totalDocs}
            </span>
            <button
              className="ml-2 flex items-center justify-center rounded bg-gray-100 px-1 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              className="flex items-center justify-center rounded bg-gray-100 px-1 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Documents
