'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'
import type { NotionOption } from '@/lib/notion'
import type { NotionTableCell, NotionTableColumn, NotionTableRow } from '@/lib/notionTable'
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Hash,
  LayoutList,
  Link2,
  Layers,
  Mail,
  Phone,
  Sigma,
  Tag,
  Type,
  Users,
} from 'lucide-react'

type ApiResponse = {
  columns?: NotionTableColumn[]
  rows?: NotionTableRow[]
  description?: string
  error?: string
}

export type NotionTableProps = {
  apiPath: string
  rowLinkPrefix: string
  dateFormat?: 'short' | 'long'
  emptyMessage?: string
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
      className={`inline-flex max-w-[220px] whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${colorBadgeClass(option.color)}`}
    >
      <span className="truncate">{option.name}</span>
    </span>
  )
}

const OptionBadges = ({ options }: { options: NotionOption[] }) => {
  if (options.length === 0) return <span className="text-gray-500 dark:text-gray-400">-</span>
  return (
    <div className="flex flex-nowrap gap-1">
      {options.map((option) => (
        <span
          key={`${option.name}-${option.color}`}
          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${colorBadgeClass(option.color)}`}
        >
          {option.name}
        </span>
      ))}
    </div>
  )
}

const ColumnHeaderIcon = ({ type }: { type: string }) => {
  const common = 'h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500'
  switch (type) {
    case 'title':
      return <Type className={common} aria-hidden />
    case 'rich_text':
      return <AlignLeft className={common} aria-hidden />
    case 'date':
    case 'created_time':
    case 'last_edited_time':
      return <Calendar className={common} aria-hidden />
    case 'select':
    case 'multi_select':
    case 'status':
      return <Tag className={common} aria-hidden />
    case 'number':
      return <Hash className={common} aria-hidden />
    case 'checkbox':
      return <CheckSquare className={common} aria-hidden />
    case 'url':
    case 'relation':
      return <Link2 className={common} aria-hidden />
    case 'email':
      return <Mail className={common} aria-hidden />
    case 'phone_number':
      return <Phone className={common} aria-hidden />
    case 'people':
      return <Users className={common} aria-hidden />
    case 'formula':
      return <Sigma className={common} aria-hidden />
    case 'rollup':
      return <Layers className={common} aria-hidden />
    default:
      return <LayoutList className={common} aria-hidden />
  }
}

const formatDate = (iso: string | null, style: 'short' | 'long') => {
  if (!iso) return '-'
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  if (style === 'long')
    return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return parsed.toLocaleDateString()
}

const getLinkColumnId = (columns: NotionTableColumn[]) => {
  const titleCol = columns.find((c) => c.type === 'title')
  return titleCol?.id ?? columns[0]?.id ?? null
}

const getRowDisplayTitle = (row: NotionTableRow, columns: NotionTableColumn[]): string => {
  const titleCol = columns.find((c) => c.type === 'title')
  if (titleCol) {
    const cell = row.cells[titleCol.id]
    if (cell?.kind === 'title') return cell.text
  }
  for (const col of columns) {
    const cell = row.cells[col.id]
    if (cell?.kind === 'title') return cell.text
    if (cell?.kind === 'plain' && cell.text) return cell.text
  }
  return 'Untitled'
}

type SortSerialized = { kind: 'number'; value: number } | { kind: 'text'; value: string }

const serializeForSort = (cell: NotionTableCell): SortSerialized => {
  switch (cell.kind) {
    case 'empty':
      return { kind: 'text', value: '' }
    case 'title':
    case 'plain':
      return { kind: 'text', value: cell.text }
    case 'date': {
      if (!cell.iso) return { kind: 'text', value: '' }
      const t = Date.parse(cell.iso)
      return Number.isNaN(t) ? { kind: 'text', value: cell.iso } : { kind: 'number', value: t }
    }
    case 'number':
      return cell.value === null
        ? { kind: 'text', value: '' }
        : { kind: 'number', value: cell.value }
    case 'options': {
      const s = cell.options.map((o) => o.name).join('\u0001')
      return { kind: 'text', value: s }
    }
    case 'checkbox':
      return { kind: 'number', value: cell.checked ? 1 : 0 }
    case 'url':
      return { kind: 'text', value: cell.href }
    case 'email':
      return { kind: 'text', value: cell.email }
    case 'phone':
      return { kind: 'text', value: cell.phone }
    case 'unsupported':
      return { kind: 'text', value: cell.label }
    default:
      return { kind: 'text', value: '' }
  }
}

const compareSerialized = (a: SortSerialized, b: SortSerialized): number => {
  if (a.kind === 'number' && b.kind === 'number') {
    if (a.value === b.value) return 0
    return a.value < b.value ? -1 : 1
  }
  const sa = a.kind === 'number' ? String(a.value) : a.value
  const sb = b.kind === 'number' ? String(b.value) : b.value
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' })
}

const compareRowsByColumn = (
  a: NotionTableRow,
  b: NotionTableRow,
  columnId: string,
  direction: 'asc' | 'desc'
): number => {
  const ca = a.cells[columnId] ?? { kind: 'empty' as const }
  const cb = b.cells[columnId] ?? { kind: 'empty' as const }
  const cmp = compareSerialized(serializeForSort(ca), serializeForSort(cb))
  return direction === 'asc' ? cmp : -cmp
}

const CellView = ({
  cell,
  dateFormat,
}: {
  cell: NotionTableCell
  dateFormat: 'short' | 'long'
}) => {
  switch (cell.kind) {
    case 'empty':
      return <span className="text-gray-500 dark:text-gray-400">-</span>
    case 'title':
      return (
        <span
          className="line-clamp-2 break-words text-gray-900 dark:text-gray-100"
          title={cell.text}
        >
          {cell.text}
        </span>
      )
    case 'plain':
      return cell.text ? (
        <span
          className="line-clamp-2 break-words text-gray-700 dark:text-gray-300"
          title={cell.text}
        >
          {cell.text}
        </span>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">-</span>
      )
    case 'date': {
      const main = formatDate(cell.iso, dateFormat)
      if (cell.endIso && cell.iso)
        return (
          <span className="whitespace-nowrap text-gray-700 dark:text-gray-300">
            {main} – {formatDate(cell.endIso, dateFormat)}
          </span>
        )
      return <span className="whitespace-nowrap text-gray-700 dark:text-gray-300">{main}</span>
    }
    case 'options':
      return cell.variant === 'multi' ? (
        <OptionBadges options={cell.options} />
      ) : (
        <OptionBadge option={cell.options[0] ?? null} />
      )
    case 'checkbox':
      return <span className="text-gray-700 dark:text-gray-300">{cell.checked ? 'Yes' : 'No'}</span>
    case 'number':
      return (
        <span className="whitespace-nowrap text-gray-700 dark:text-gray-300">
          {cell.value === null ? '-' : String(cell.value)}
        </span>
      )
    case 'url':
      return cell.href ? (
        <Link
          href={cell.href}
          className="line-clamp-1 break-all text-primary-600 [overflow-wrap:anywhere] hover:underline dark:text-primary-400"
          title={cell.href}
        >
          {cell.href}
        </Link>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">-</span>
      )
    case 'email':
      return cell.email ? (
        <a
          href={`mailto:${cell.email}`}
          className="text-primary-600 hover:underline dark:text-primary-400"
        >
          {cell.email}
        </a>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">-</span>
      )
    case 'phone':
      return cell.phone ? (
        <a
          href={`tel:${cell.phone}`}
          className="text-primary-600 hover:underline dark:text-primary-400"
        >
          {cell.phone}
        </a>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">-</span>
      )
    case 'unsupported':
      return (
        <span className="truncate text-xs text-gray-500 dark:text-gray-400" title={cell.label}>
          {cell.label}
        </span>
      )
    default:
      return <span className="text-gray-500 dark:text-gray-400">-</span>
  }
}

export default function NotionTable({
  apiPath,
  rowLinkPrefix,
  dateFormat = 'short',
  emptyMessage = 'No rows found in this Notion database.',
}: NotionTableProps) {
  const [columns, setColumns] = useState<NotionTableColumn[]>([])
  const [rows, setRows] = useState<NotionTableRow[]>([])
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortColumnId, setSortColumnId] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const linkColumnId = useMemo(() => getLinkColumnId(columns), [columns])

  const displayRows = useMemo(() => {
    if (!sortColumnId) return rows
    return [...rows].sort((a, b) => compareRowsByColumn(a, b, sortColumnId, sortDirection))
  }, [rows, sortColumnId, sortDirection])

  const onHeaderSortClick = (columnId: string) => {
    if (sortColumnId !== columnId) {
      setSortColumnId(columnId)
      setSortDirection('asc')
      return
    }
    if (sortDirection === 'asc') {
      setSortDirection('desc')
      return
    }
    setSortColumnId(null)
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(apiPath)
        const data = (await response.json()) as ApiResponse
        if (!response.ok) {
          setError(data.error || 'Unable to load table.')
          return
        }
        setColumns(data.columns || [])
        setRows(data.rows || [])
        setDescription(typeof data.description === 'string' ? data.description : '')
      } catch (err) {
        setError('Network error while fetching table.')
        console.error('NotionTable fetch failed:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [apiPath])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
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

  if (columns.length === 0 || rows.length === 0) {
    return (
      <div className="space-y-3">
        {description.trim() ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        ) : null}
        <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {emptyMessage}
        </div>
      </div>
    )
  }

  const minWidth = Math.max(640, columns.length * 140)

  return (
    <div className="space-y-3">
      {description.trim() ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {columns.map((col) => {
                const active = sortColumnId === col.id
                return (
                  <th
                    key={col.id}
                    className="px-4 py-3"
                    aria-sort={
                      active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    <button
                      type="button"
                      onClick={() => onHeaderSortClick(col.id)}
                      className="group inline-flex w-full min-w-0 items-center gap-2 rounded-md text-left text-gray-600 outline-none ring-primary-500 transition hover:text-gray-900 focus-visible:ring-2 dark:text-gray-400 dark:hover:text-gray-100"
                      aria-label={
                        active
                          ? sortDirection === 'asc'
                            ? `Sorted ascending by ${col.name}, click for descending`
                            : `Sorted descending by ${col.name}, click to clear sort`
                          : `Sort by ${col.name}`
                      }
                    >
                      <ColumnHeaderIcon type={col.type} />
                      <span className="min-w-0 flex-1 normal-case">{col.name}</span>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 group-hover:bg-gray-200/80 group-hover:text-gray-700 dark:group-hover:bg-gray-800 dark:group-hover:text-gray-200">
                        {active ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" aria-hidden />
                          ) : (
                            <ChevronDown className="h-4 w-4" aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-60" aria-hidden />
                        )}
                      </span>
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {displayRows.map((row) => (
              <tr
                key={row.pageId}
                className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-900/70"
              >
                {columns.map((col) => {
                  const cell = row.cells[col.id] ?? { kind: 'empty' as const }
                  const isLinkCol = linkColumnId !== null && col.id === linkColumnId
                  if (isLinkCol) {
                    const label = getRowDisplayTitle(row, columns)
                    return (
                      <td
                        key={col.id}
                        className="max-w-[min(18rem,42vw)] px-4 py-3 font-medium text-gray-900 dark:text-gray-100"
                      >
                        <Link
                          href={`${rowLinkPrefix}/${row.pageId}`}
                          className="flex items-start gap-2 hover:text-primary-500"
                        >
                          <span className="mt-0.5 shrink-0" aria-hidden>
                            {row.icon.type === 'emoji' && row.icon.value ? row.icon.value : '📄'}
                          </span>
                          <span className="line-clamp-2 min-w-0 break-words" title={label}>
                            {label}
                          </span>
                        </Link>
                      </td>
                    )
                  }
                  return (
                    <td
                      key={col.id}
                      className={
                        col.type === 'rich_text'
                          ? 'max-w-[min(16rem,40vw)] px-4 py-3 align-top text-gray-700 dark:text-gray-300'
                          : col.type === 'title'
                            ? 'max-w-[min(14rem,36vw)] px-4 py-3 align-top text-gray-700 dark:text-gray-300'
                            : 'whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300'
                      }
                    >
                      <CellView cell={cell} dateFormat={dateFormat} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
