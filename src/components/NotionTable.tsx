'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { NotionOption } from '@/lib/notion'
import type { NotionTableCell, NotionTableColumn, NotionTableRow } from '@/lib/notionTable'
import {
  ArrowsDownUpIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckSquareIcon,
  EnvelopeSimpleIcon,
  FunctionIcon,
  HashIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  PhoneIcon,
  StackSimpleIcon,
  TagIcon,
  TextAlignLeftIcon,
  TextTIcon,
  UsersIcon,
} from '@phosphor-icons/react'

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
    case 'green':
    case 'yellow':
    case 'orange':
    case 'red':
    case 'purple':
    case 'pink':
      return 'bg-muted text-foreground'
    default:
      return 'bg-muted text-foreground'
  }
}

const OptionBadge = ({ option }: { option: NotionOption | null }) => {
  if (!option) return <span className="text-muted-foreground">-</span>
  return (
    <Badge
      variant="secondary"
      className={`max-w-[220px] truncate ${colorBadgeClass(option.color)}`}
    >
      <span className="truncate">{option.name}</span>
    </Badge>
  )
}

const OptionBadges = ({ options }: { options: NotionOption[] }) => {
  if (options.length === 0) return <span className="text-muted-foreground">-</span>
  return (
    <div className="flex flex-nowrap gap-1">
      {options.map((option) => (
        <Badge
          key={`${option.name}-${option.color}`}
          variant="secondary"
          className={colorBadgeClass(option.color)}
        >
          {option.name}
        </Badge>
      ))}
    </div>
  )
}

const ColumnHeaderIcon = ({ type }: { type: string }) => {
  const common = 'text-muted-foreground size-3.5 shrink-0'
  switch (type) {
    case 'title':
      return <TextTIcon className={common} aria-hidden />
    case 'rich_text':
      return <TextAlignLeftIcon className={common} aria-hidden />
    case 'date':
    case 'created_time':
    case 'last_edited_time':
      return <CalendarBlankIcon className={common} aria-hidden />
    case 'select':
    case 'multi_select':
    case 'status':
      return <TagIcon className={common} aria-hidden />
    case 'number':
      return <HashIcon className={common} aria-hidden />
    case 'checkbox':
      return <CheckSquareIcon className={common} aria-hidden />
    case 'url':
    case 'relation':
      return <LinkSimpleIcon className={common} aria-hidden />
    case 'email':
      return <EnvelopeSimpleIcon className={common} aria-hidden />
    case 'phone_number':
      return <PhoneIcon className={common} aria-hidden />
    case 'people':
      return <UsersIcon className={common} aria-hidden />
    case 'formula':
      return <FunctionIcon className={common} aria-hidden />
    case 'rollup':
      return <StackSimpleIcon className={common} aria-hidden />
    default:
      return <ListBulletsIcon className={common} aria-hidden />
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
      return <span className="text-muted-foreground">-</span>
    case 'title':
      return (
        <span className="text-foreground line-clamp-2 break-words" title={cell.text}>
          {cell.text}
        </span>
      )
    case 'plain':
      return cell.text ? (
        <span className="text-muted-foreground line-clamp-2 break-words" title={cell.text}>
          {cell.text}
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    case 'date': {
      const main = formatDate(cell.iso, dateFormat)
      if (cell.endIso && cell.iso)
        return (
          <span className="text-muted-foreground whitespace-nowrap">
            {main} - {formatDate(cell.endIso, dateFormat)}
          </span>
        )
      return <span className="text-muted-foreground whitespace-nowrap">{main}</span>
    }
    case 'options':
      return cell.variant === 'multi' ? (
        <OptionBadges options={cell.options} />
      ) : (
        <OptionBadge option={cell.options[0] ?? null} />
      )
    case 'checkbox':
      return <span className="text-muted-foreground">{cell.checked ? 'Yes' : 'No'}</span>
    case 'number':
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {cell.value === null ? '-' : String(cell.value)}
        </span>
      )
    case 'url':
      return cell.href ? (
        <Link
          href={cell.href}
          className="text-foreground line-clamp-1 break-all [overflow-wrap:anywhere] hover:underline"
          title={cell.href}
        >
          {cell.href}
        </Link>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    case 'email':
      return cell.email ? (
        <a href={`mailto:${cell.email}`} className="text-foreground hover:underline">
          {cell.email}
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    case 'phone':
      return cell.phone ? (
        <a href={`tel:${cell.phone}`} className="text-foreground hover:underline">
          {cell.phone}
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    case 'unsupported':
      return (
        <span className="text-muted-foreground truncate text-xs" title={cell.label}>
          {cell.label}
        </span>
      )
    default:
      return <span className="text-muted-foreground">-</span>
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
      <Card className="bg-card/60 py-0 ring-0">
        <CardContent className="flex flex-col gap-2 py-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 text-destructive py-0 ring-0">
        <CardContent className="py-4 text-sm">{error}</CardContent>
      </Card>
    )
  }

  if (columns.length === 0 || rows.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {description.trim() ? (
          <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
        <Card className="bg-card/60 py-0 ring-0">
          <CardContent className="text-muted-foreground py-4 text-sm">{emptyMessage}</CardContent>
        </Card>
      </div>
    )
  }

  const minWidth = Math.max(640, columns.length * 140)

  return (
    <div className="flex flex-col gap-3">
      {description.trim() ? (
        <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      <Card className="bg-card/60 py-0 ring-0">
        <CardContent className="p-0">
          <Table className="text-sm" style={{ minWidth }}>
            <TableHeader className="bg-muted/60">
              <TableRow className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wide">
                {columns.map((col) => {
                  const active = sortColumnId === col.id
                  return (
                    <TableHead
                      key={col.id}
                      className="px-4 py-3"
                      aria-sort={
                        active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
                      }
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onHeaderSortClick(col.id)}
                        className="text-muted-foreground hover:text-foreground group h-auto w-full justify-start px-0 py-0 text-left"
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
                        <span className="text-muted-foreground group-hover:bg-muted group-hover:text-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center">
                          {active ? (
                            sortDirection === 'asc' ? (
                              <CaretUpIcon className="size-4" aria-hidden />
                            ) : (
                              <CaretDownIcon className="size-4" aria-hidden />
                            )
                          ) : (
                            <ArrowsDownUpIcon className="size-4 opacity-60" aria-hidden />
                          )}
                        </span>
                      </Button>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-border divide-y">
              {displayRows.map((row) => (
                <TableRow key={row.pageId} className="hover:bg-muted/40 transition-colors">
                  {columns.map((col) => {
                    const cell = row.cells[col.id] ?? { kind: 'empty' as const }
                    const isLinkCol = linkColumnId !== null && col.id === linkColumnId
                    if (isLinkCol) {
                      const label = getRowDisplayTitle(row, columns)
                      return (
                        <TableCell
                          key={col.id}
                          className="text-foreground max-w-[min(18rem,42vw)] px-4 py-3 font-medium"
                        >
                          <Link
                            href={`${rowLinkPrefix}/${row.pageId}`}
                            className="hover:text-foreground flex items-start gap-2"
                          >
                            <span className="mt-0.5 shrink-0" aria-hidden>
                              {row.icon.type === 'emoji' && row.icon.value ? row.icon.value : '📄'}
                            </span>
                            <span className="line-clamp-2 min-w-0 break-words" title={label}>
                              {label}
                            </span>
                          </Link>
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell
                        key={col.id}
                        className={
                          col.type === 'rich_text'
                            ? 'text-muted-foreground max-w-[min(16rem,40vw)] px-4 py-3 align-top'
                            : col.type === 'title'
                              ? 'text-muted-foreground max-w-[min(14rem,36vw)] px-4 py-3 align-top'
                              : 'text-muted-foreground whitespace-nowrap px-4 py-3'
                        }
                      >
                        <CellView cell={cell} dateFormat={dateFormat} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
