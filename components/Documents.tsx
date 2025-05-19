'use client'

import { Doc } from '@/data/documentsData'
import { useEffect, useState } from 'react'
import Link from './Link'

const PAGE_SIZE = 10
const MIN_CONTAINER_HEIGHT = 400

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
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 10.172 2H6zm2 0v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

// Skeleton loader for table
function SkeletonTable({ rows = 10 }) {
  return (
    <table className="w-full min-w-[600px] animate-pulse divide-y divide-gray-700 text-sm sm:text-base">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-4 py-3" colSpan={5}>
            <div className="mx-auto h-4 w-1/3 rounded bg-gray-700" />
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-900">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td className="px-4 py-2">
              <div className="h-4 w-4 rounded bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-32 rounded bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-24 rounded bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-16 rounded bg-gray-700" />
            </td>
            <td className="px-4 py-2">
              <div className="h-4 w-20 rounded bg-gray-700" />
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

  const totalPages = Math.max(1, Math.ceil(documents.length / PAGE_SIZE))
  const paginatedDocuments = documents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div
      className={`min-h-[${MIN_CONTAINER_HEIGHT}px] w-full rounded-lg bg-gray-900 p-2 text-gray-100 shadow-md sm:p-4`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
            />
          </svg>
          hoangndst
        </div>
        <button
          className="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          onClick={() => fetchDocuments()}
          disabled={isLoading}
          title="Refresh"
          aria-label="Refresh documents"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.978 7.978 0 0 1 12 4c2.042 0 3.899.767 5.318 2.018M18.418 15A7.978 7.978 0 0 1 12 20c-2.042 0-3.899-.767-5.318-2.018"
            />
          </svg>
          Refresh
        </button>
      </div>
      <div className="w-full max-w-full overflow-x-auto rounded-lg border border-gray-700">
        {isLoading ? (
          <SkeletonTable rows={PAGE_SIZE} />
        ) : (
          <table className="w-full min-w-[600px] divide-y divide-gray-700 text-sm sm:text-base">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 border-gray-600 bg-gray-900 text-blue-500"
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
            <tbody className="divide-y divide-gray-700 bg-gray-900">
              {paginatedDocuments.map((d, idx) => (
                <tr key={d.name} className="transition-colors hover:bg-gray-800">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 border-gray-600 bg-gray-900 text-blue-500"
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
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-400">
                    {formatDate(d.lastModified)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-400">
                    {d.size ? d.size : '-'}
                  </td>
                  <td className="flex gap-2 px-4 py-2">
                    {d.downloadUrl && (
                      <Link
                        href={d.downloadUrl}
                        className="text-sm text-blue-400 hover:underline"
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
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <button
            className="rounded bg-gray-800 px-3 py-1 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="rounded bg-gray-800 px-3 py-1 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Documents
