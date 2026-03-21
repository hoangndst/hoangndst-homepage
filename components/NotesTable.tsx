'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/Link'
import type { NotionOption, NotionResourceRow } from '@/lib/notion'

type ApiResponse = {
  resources?: NotionResourceRow[]
  error?: string
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString()
}

const colorBadgeClass = (color: string) => {
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
    case 'pink':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const OptionBadge = ({ option }: { option: NotionOption | null }) => {
  if (!option) return <span className="text-gray-500 dark:text-gray-400">-</span>
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${colorBadgeClass(option.color)}`}
    >
      {option.name}
    </span>
  )
}

const TopicBadges = ({ options }: { options: NotionOption[] }) => {
  if (options.length === 0) return <span className="text-gray-500 dark:text-gray-400">-</span>
  return (
    <div className="flex flex-nowrap gap-1">
      {options.map((option) => (
        <span
          key={`${option.name}-${option.color}`}
          className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${colorBadgeClass(option.color)}`}
        >
          {option.name}
        </span>
      ))}
    </div>
  )
}

export default function NotesTable() {
  const [resources, setResources] = useState<NotionResourceRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/notes')
        const data = (await response.json()) as ApiResponse
        if (!response.ok) {
          setError(data.error || 'Unable to load notes.')
          return
        }
        setResources(data.resources || [])
      } catch (err) {
        setError('Network error while fetching notes.')
        console.error('Failed to fetch notes:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No resources found in Notion database.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <table className="w-full min-w-[1020px] text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">Resource Name</th>
            <th className="px-4 py-3">Topic</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Date Added</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {resources.map((resource) => (
            <tr
              key={resource.id}
              className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-900/70"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                <Link
                  href={`/notes/${resource.id}`}
                  className="inline-flex items-start gap-2 hover:text-primary-500"
                >
                  <span className="mt-0.5">
                    {resource.icon.type === 'emoji' && resource.icon.value
                      ? resource.icon.value
                      : '📄'}
                  </span>
                  <span>{resource.title}</span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                <TopicBadges options={resource.topic} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                <OptionBadge option={resource.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                <OptionBadge option={resource.priority} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                {formatDate(resource.dateAdded)}
              </td>
              <td className="max-w-[280px] truncate px-4 py-3 text-gray-600 dark:text-gray-400">
                {resource.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
