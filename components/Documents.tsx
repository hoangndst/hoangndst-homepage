'use client'

import { Doc } from '@/data/documentsData'
import { useEffect, useState } from 'react'
import Link from './Link'

const Documents = () => {
  const [documents, setDocuments] = useState<Doc[]>([])

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/documents`)
        const data = await response.json()
        if (response.ok) {
          const objects = data.objects
          setDocuments(objects)
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err)
      }
    }
    fetchDocuments()
  }, [])

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 md:px-8">
      {documents.map((d) => (
        <Document
          key={d.name}
          name={d.name}
          description={d.description}
          size={d.size}
          downloadUrl={d.downloadUrl}
        />
      ))}
    </div>
  )
}

const Document = ({ name, description, size, downloadUrl }) => (
  <div className="overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 p-4 dark:border-gray-700">
    <div className="p-6">
      <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
        {downloadUrl ? (
          <Link href={downloadUrl} aria-label={`Link to ${downloadUrl}`}>
            {name}
          </Link>
        ) : (
          name
        )}
      </h2>
      <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>

      {downloadUrl && (
        <div className="flex justify-between py-4 pl-4 pr-5 text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
          <div className="flex w-0 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.4 9.6l-8.3 8.3c-2.4 2.4-6.1 2.4-8.5 0s-2.4-6.1 0-8.5l8.3-8.3c1.8-1.8 4.7-1.8 6.5 0s1.8 4.7 0 6.5l-8.3 8.3c-1.1 1.1-3 1.1-4.1 0s-1.1-3 0-4.1l8.3-8.3 1.4 1.4-8.3 8.3c-.4.4-.4 1.2 0 1.6s1.2.4 1.6 0l8.3-8.3c1.1-1.1 1.1-2.9 0-4.1s-2.9-1.1-4.1 0l-8.3 8.3c-1.8 1.8-1.8 4.7 0 6.5s4.7 1.8 6.5 0l8.3-8.3 1.4 1.4z" />
            </svg>

            <div className="ml-1 flex min-w-0 flex-1 gap-2">
              <span className="shrink-0 text-gray-400">{size}</span>
            </div>
          </div>

          <div className="ml-4 shrink-0">
            <Link
              href={downloadUrl}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${downloadUrl}`}
            >
              Download &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
)

export default Documents
