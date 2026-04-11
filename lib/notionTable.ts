import { isFullDatabase, isFullDataSource } from '@notionhq/client'
import type {
  DataSourceObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import {
  getDataSourceIdFromDatabase,
  getNotionClient,
  mapPageIcon,
  queryAllPagesFromDataSource,
} from '@/lib/notion'
import type { NoteIcon, NotionOption } from '@/lib/notion'

export type NotionTableColumn = {
  id: string
  name: string
  type: string
  schemaKey: string
}

export type NotionTableCell =
  | { kind: 'empty' }
  | { kind: 'title'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'date'; iso: string | null; endIso?: string | null }
  | { kind: 'options'; options: NotionOption[]; variant: 'single' | 'multi' }
  | { kind: 'checkbox'; checked: boolean }
  | { kind: 'number'; value: number | null }
  | { kind: 'url'; href: string }
  | { kind: 'email'; email: string }
  | { kind: 'phone'; phone: string }
  | { kind: 'unsupported'; label: string }

export type NotionTableRow = {
  pageId: string
  icon: NoteIcon
  cells: Record<string, NotionTableCell>
}

export type NotionDatabaseTable = {
  columns: NotionTableColumn[]
  rows: NotionTableRow[]
  description: string
}

const joinPlain = (rich: RichTextItemResponse[] = []) =>
  rich
    .map((item) => item.plain_text || '')
    .join('')
    .trim()

const optionFromSelect = (item: { name: string; color?: string } | null): NotionOption | null =>
  item ? { name: item.name, color: item.color || 'default' } : null

const buildColumns = (dataSource: DataSourceObjectResponse): NotionTableColumn[] => {
  const props = dataSource.properties
  if (!props) return []
  const cols = Object.entries(props).map(([schemaKey, spec]) => ({
    id: spec.id,
    name: spec.name,
    type: spec.type,
    schemaKey,
  }))
  const titleCols = cols.filter((c) => c.type === 'title')
  const restCols = cols.filter((c) => c.type !== 'title')
  return [...titleCols, ...restCols]
}

export const propertyValueToCell = (
  expectedType: string,
  raw: PageObjectResponse['properties'][string] | undefined
): NotionTableCell => {
  if (raw === undefined || raw === null) return { kind: 'empty' }
  if (typeof raw !== 'object' || !('type' in raw))
    return { kind: 'unsupported', label: expectedType }

  switch (raw.type) {
    case 'title':
      return { kind: 'title', text: joinPlain(raw.title) || 'Untitled' }
    case 'rich_text':
      return { kind: 'plain', text: joinPlain(raw.rich_text) }
    case 'number':
      return { kind: 'number', value: raw.number ?? null }
    case 'select': {
      const opt = optionFromSelect(raw.select)
      return opt ? { kind: 'options', options: [opt], variant: 'single' } : { kind: 'empty' }
    }
    case 'status': {
      const opt = optionFromSelect(raw.status)
      return opt ? { kind: 'options', options: [opt], variant: 'single' } : { kind: 'empty' }
    }
    case 'multi_select':
      return raw.multi_select.length === 0
        ? { kind: 'empty' }
        : {
            kind: 'options',
            options: raw.multi_select.map((item) => ({
              name: item.name,
              color: item.color || 'default',
            })),
            variant: 'multi',
          }
    case 'date': {
      if (!raw.date) return { kind: 'date', iso: null }
      return {
        kind: 'date',
        iso: raw.date.start ?? null,
        endIso: raw.date.end ?? null,
      }
    }
    case 'checkbox':
      return { kind: 'checkbox', checked: Boolean(raw.checkbox) }
    case 'url':
      return { kind: 'url', href: raw.url?.trim() || '' }
    case 'email':
      return { kind: 'email', email: raw.email?.trim() || '' }
    case 'phone_number':
      return { kind: 'phone', phone: raw.phone_number?.trim() || '' }
    case 'people': {
      const n = raw.people.length
      return { kind: 'plain', text: n === 0 ? '' : `${n} ${n === 1 ? 'person' : 'people'}` }
    }
    case 'files': {
      const n = raw.files.length
      return { kind: 'plain', text: n === 0 ? '' : `${n} ${n === 1 ? 'file' : 'files'}` }
    }
    case 'relation': {
      const n = raw.relation.length
      return { kind: 'plain', text: n === 0 ? '' : `${n} linked` }
    }
    case 'created_time':
      return { kind: 'plain', text: raw.created_time || '' }
    case 'last_edited_time':
      return { kind: 'plain', text: raw.last_edited_time || '' }
    case 'created_by':
      return { kind: 'plain', text: raw.created_by.id ? 'User' : '' }
    case 'last_edited_by':
      return { kind: 'plain', text: raw.last_edited_by.id ? 'User' : '' }
    case 'unique_id':
      return {
        kind: 'plain',
        text: [raw.unique_id.prefix, raw.unique_id.number].filter(Boolean).join('-'),
      }
    case 'formula': {
      const f = raw.formula
      switch (f.type) {
        case 'string':
          return { kind: 'plain', text: f.string ?? '' }
        case 'number':
          return { kind: 'number', value: f.number ?? null }
        case 'boolean':
          return { kind: 'checkbox', checked: Boolean(f.boolean) }
        case 'date':
          return f.date
            ? { kind: 'date', iso: f.date.start ?? null, endIso: f.date.end ?? null }
            : { kind: 'date', iso: null }
        default: {
          const ft = f as { type: string }
          return { kind: 'unsupported', label: `formula:${ft.type}` }
        }
      }
    }
    case 'rollup': {
      const r = raw.rollup
      if (r.type === 'number') return { kind: 'number', value: r.number ?? null }
      if (r.type === 'date')
        return r.date
          ? { kind: 'date', iso: r.date.start ?? null, endIso: r.date.end ?? null }
          : { kind: 'date', iso: null }
      if (r.type === 'array') {
        const len = r.array.length
        return { kind: 'plain', text: len === 0 ? '' : `${len} items` }
      }
      return { kind: 'unsupported', label: 'rollup' }
    }
    case 'verification':
      return { kind: 'plain', text: raw.verification?.state || '' }
    case 'button':
      return { kind: 'unsupported', label: 'button' }
    default:
      return { kind: 'unsupported', label: raw.type }
  }
}

const resolvePageRawProperty = (
  pageProps: PageObjectResponse['properties'],
  col: NotionTableColumn
): PageObjectResponse['properties'][string] | undefined => {
  const tryKeys = [col.schemaKey, col.name, col.id]
  for (const key of tryKeys) {
    if (!key) continue
    const raw = pageProps[key]
    if (raw && typeof raw === 'object' && 'type' in raw) return raw
  }
  for (const value of Object.values(pageProps)) {
    if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      'type' in value &&
      (value as { id: string }).id === col.id
    ) {
      return value as PageObjectResponse['properties'][string]
    }
  }
  return undefined
}

const pageToRow = (page: PageObjectResponse, columns: NotionTableColumn[]): NotionTableRow => {
  const cells: Record<string, NotionTableCell> = {}
  const props = page.properties || {}
  for (const col of columns) {
    const raw = resolvePageRawProperty(props, col)
    cells[col.id] = propertyValueToCell(col.type, raw)
  }
  return {
    pageId: page.id,
    icon: mapPageIcon(page.icon),
    cells,
  }
}

export const getNotionDatabaseTable = async (databaseId: string): Promise<NotionDatabaseTable> => {
  const notionClient = getNotionClient()
  const database = await notionClient.databases.retrieve({ database_id: databaseId })
  if (!isFullDatabase(database))
    throw new Error('Notion returned a partial database response; cannot resolve data source.')
  const dataSourceId = getDataSourceIdFromDatabase(database)
  const dataSourceResponse = await notionClient.dataSources.retrieve({
    data_source_id: dataSourceId,
  })
  if (!isFullDataSource(dataSourceResponse))
    throw new Error('Notion returned a partial data source; cannot read column schema.')
  const pages = await queryAllPagesFromDataSource(notionClient, dataSourceId)
  const columns = buildColumns(dataSourceResponse)
  const rows = pages.map((page) => pageToRow(page, columns))
  const fromDataSource = joinPlain(dataSourceResponse.description ?? [])
  const fromDatabase = joinPlain(database.description ?? [])
  const description = (fromDataSource.trim() || fromDatabase.trim()).trim()
  return { columns, rows, description }
}
