import { Client, isFullBlock, isFullPage } from '@notionhq/client'
import type {
  BlockObjectResponse,
  DataSourceObjectResponse,
  PageObjectResponse,
  PartialDataSourceObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

export type NoteTextSpan = {
  text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

export type NoteIcon = { type: 'emoji' | 'external' | 'file' | 'none'; value: string }
export type NotionOption = { name: string; color: string }

export type NoteBlock = {
  id: string
  type:
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'quote'
    | 'code'
    | 'to_do'
    | 'callout'
    | 'toggle'
    | 'divider'
    | 'image'
    | 'bookmark'
    | 'embed'
    | 'video'
    | 'audio'
    | 'file'
    | 'pdf'
    | 'equation'
    | 'link_preview'
    | 'unsupported'
  richText: NoteTextSpan[]
  language?: string
  checked?: boolean
  icon?: NoteIcon
  imageUrl?: string
  imageCaption?: NoteTextSpan[]
  url?: string
  fileName?: string
  equation?: string
  children?: NoteBlock[]
}

export type NotionNotePayload = {
  id: string
  title: string
  lastEditedTime: string
  icon: NoteIcon
  topic: NotionOption[]
  status: NotionOption | null
  priority: NotionOption | null
  blocks: NoteBlock[]
}

const parseRichText = (richText: RichTextItemResponse[] = []): NoteTextSpan[] =>
  richText.map((item) => ({
    text: item.plain_text || '',
    href: item.href || null,
    annotations: {
      bold: Boolean(item.annotations?.bold),
      italic: Boolean(item.annotations?.italic),
      strikethrough: Boolean(item.annotations?.strikethrough),
      underline: Boolean(item.annotations?.underline),
      code: Boolean(item.annotations?.code),
      color: item.annotations?.color || 'default',
    },
  }))

const supportedBlockTypes = new Set([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'bulleted_list_item',
  'numbered_list_item',
  'quote',
  'code',
  'to_do',
  'callout',
  'toggle',
  'divider',
  'image',
  'bookmark',
  'embed',
  'video',
  'audio',
  'file',
  'pdf',
  'equation',
  'link_preview',
])

const extractBlockText = (block: BlockObjectResponse): NoteTextSpan[] => {
  switch (block.type) {
    case 'paragraph':
      return parseRichText(block.paragraph.rich_text)
    case 'heading_1':
      return parseRichText(block.heading_1.rich_text)
    case 'heading_2':
      return parseRichText(block.heading_2.rich_text)
    case 'heading_3':
      return parseRichText(block.heading_3.rich_text)
    case 'bulleted_list_item':
      return parseRichText(block.bulleted_list_item.rich_text)
    case 'numbered_list_item':
      return parseRichText(block.numbered_list_item.rich_text)
    case 'quote':
      return parseRichText(block.quote.rich_text)
    case 'code':
      return parseRichText(block.code.rich_text)
    case 'to_do':
      return parseRichText(block.to_do.rich_text)
    case 'callout':
      return parseRichText(block.callout.rich_text)
    case 'toggle':
      return parseRichText(block.toggle.rich_text)
    case 'equation':
      return [
        {
          text: block.equation.expression || '',
          href: null,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
        },
      ]
    default:
      return []
  }
}

export const mapPageIcon = (icon: PageObjectResponse['icon']): NoteIcon => {
  if (!icon) return { type: 'none', value: '' }
  if (icon.type === 'emoji') return { type: 'emoji', value: icon.emoji }
  if (icon.type === 'external') return { type: 'external', value: icon.external.url }
  if (icon.type === 'file') return { type: 'file', value: icon.file.url }
  return { type: 'none', value: '' }
}

const mapBlock = (block: BlockObjectResponse, children: NoteBlock[]): NoteBlock => {
  const safeType = supportedBlockTypes.has(block.type) ? block.type : 'unsupported'
  const mapped: NoteBlock = {
    id: block.id,
    type: safeType as NoteBlock['type'],
    richText: extractBlockText(block),
  }
  if (safeType === 'code' && block.type === 'code')
    mapped.language = block.code.language || 'plain text'
  if (safeType === 'to_do' && block.type === 'to_do') mapped.checked = block.to_do.checked
  if (safeType === 'callout' && block.type === 'callout' && block.callout.icon?.type === 'emoji') {
    mapped.icon = { type: 'emoji', value: block.callout.icon.emoji }
  }
  if (safeType === 'image' && block.type === 'image') {
    if (block.image.type === 'external') mapped.imageUrl = block.image.external.url
    if (block.image.type === 'file') mapped.imageUrl = block.image.file.url
    mapped.imageCaption = parseRichText(block.image.caption || [])
  }
  if (safeType === 'bookmark' && block.type === 'bookmark') mapped.url = block.bookmark.url || ''
  if (safeType === 'link_preview' && block.type === 'link_preview')
    mapped.url = block.link_preview.url || ''
  if (safeType === 'embed' && block.type === 'embed') mapped.url = block.embed.url || ''
  if (safeType === 'video' && block.type === 'video') {
    mapped.url = block.video.type === 'external' ? block.video.external.url : block.video.file.url
  }
  if (safeType === 'audio' && block.type === 'audio') {
    mapped.url = block.audio.type === 'external' ? block.audio.external.url : block.audio.file.url
  }
  if (safeType === 'file' && block.type === 'file') {
    mapped.url = block.file.type === 'external' ? block.file.external.url : block.file.file.url
    mapped.fileName = block.file.name || 'Download file'
  }
  if (safeType === 'pdf' && block.type === 'pdf') {
    mapped.url = block.pdf.type === 'external' ? block.pdf.external.url : block.pdf.file.url
  }
  if (safeType === 'equation' && block.type === 'equation')
    mapped.equation = block.equation.expression || ''
  if (children.length > 0) mapped.children = children
  return mapped
}

const fetchBlockChildren = async (
  notionClient: Client,
  blockId: string
): Promise<BlockObjectResponse[]> => {
  const allBlocks: BlockObjectResponse[] = []
  let nextCursor: string | undefined
  do {
    const data = await notionClient.blocks.children.list({
      block_id: blockId,
      start_cursor: nextCursor,
      page_size: 100,
    })
    allBlocks.push(...data.results.filter(isFullBlock))
    nextCursor = data.has_more ? (data.next_cursor ?? undefined) : undefined
  } while (nextCursor)
  return allBlocks
}

type TitleProperty = { type: 'title'; title: Array<{ plain_text: string }> }
const isTitleProperty = (value: unknown): value is TitleProperty =>
  Boolean(
    value &&
      typeof value === 'object' &&
      (value as { type?: string }).type === 'title' &&
      Array.isArray((value as { title?: unknown }).title)
  )

const normalizePageTitle = (pageData: PageObjectResponse): string => {
  const titleProperty = Object.values(pageData.properties || {}).find((prop) =>
    isTitleProperty(prop)
  )
  if (!titleProperty?.title) return 'Notes'
  return (
    titleProperty.title
      .map((t) => t?.plain_text || '')
      .join('')
      .trim() || 'Notes'
  )
}

const buildBlocksTree = async (notionClient: Client, blockId: string): Promise<NoteBlock[]> => {
  const children = await fetchBlockChildren(notionClient, blockId)
  return Promise.all(
    children.map(async (block) =>
      mapBlock(block, block.has_children ? await buildBlocksTree(notionClient, block.id) : [])
    )
  )
}

export const getNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('Missing NOTION_API_KEY environment variable.')
  return new Client({ auth: apiKey })
}

type ResourceRowMeta = {
  id: string
  title: string
  icon: NoteIcon
  topic: NotionOption[]
  status: NotionOption | null
  priority: NotionOption | null
  dateAdded: string | null
  notes: string
}

const normalizePageToResourceRow = (page: PageObjectResponse): ResourceRowMeta => {
  const properties = page.properties || {}
  const titleProperty = (properties['Resource Name'] ||
    Object.values(properties).find(isTitleProperty)) as TitleProperty | undefined
  const topicProperty = properties['Topic']
  const statusProperty = properties['Status']
  const priorityProperty = properties['Priority']
  const dateAddedProperty = properties['Date Added']
  const notesProperty = properties['Notes']

  const topic =
    topicProperty?.type === 'multi_select'
      ? topicProperty.multi_select.map((item) => ({
          name: item.name,
          color: item.color || 'default',
        }))
      : topicProperty?.type === 'select' && topicProperty.select
        ? [{ name: topicProperty.select.name, color: topicProperty.select.color || 'default' }]
        : []

  const status =
    statusProperty?.type === 'status'
      ? statusProperty.status
        ? { name: statusProperty.status.name, color: statusProperty.status.color || 'default' }
        : null
      : statusProperty?.type === 'select' && statusProperty.select
        ? { name: statusProperty.select.name, color: statusProperty.select.color || 'default' }
        : null

  const priority =
    priorityProperty?.type === 'select'
      ? priorityProperty.select
        ? { name: priorityProperty.select.name, color: priorityProperty.select.color || 'default' }
        : null
      : priorityProperty?.type === 'status' && priorityProperty.status
        ? { name: priorityProperty.status.name, color: priorityProperty.status.color || 'default' }
        : null

  return {
    id: page.id,
    title:
      titleProperty?.title
        ?.map((item) => item.plain_text || '')
        .join('')
        .trim() || 'Untitled',
    icon: mapPageIcon(page.icon),
    topic,
    status,
    priority,
    dateAdded: dateAddedProperty?.type === 'date' ? (dateAddedProperty.date?.start ?? null) : null,
    notes:
      notesProperty?.type === 'rich_text'
        ? notesProperty.rich_text
            .map((item) => item.plain_text || '')
            .join('')
            .trim()
        : '',
  }
}

const normalizePageToDishRowForDetail = (page: PageObjectResponse) => {
  const properties = page.properties || {}
  const titleProperty = (properties['Dish Name'] ||
    Object.values(properties).find(isTitleProperty)) as TitleProperty | undefined
  const ratingProperty = properties['Rating']
  const mealTypeProperty = properties['Meal Type']

  const rating =
    ratingProperty?.type === 'select' && ratingProperty.select
      ? { name: ratingProperty.select.name, color: ratingProperty.select.color || 'default' }
      : ratingProperty?.type === 'status' && ratingProperty.status
        ? { name: ratingProperty.status.name, color: ratingProperty.status.color || 'default' }
        : ratingProperty?.type === 'multi_select' && ratingProperty.multi_select.length > 0
          ? {
              name: ratingProperty.multi_select[0].name,
              color: ratingProperty.multi_select[0].color || 'default',
            }
          : null

  const mealType =
    mealTypeProperty?.type === 'multi_select'
      ? mealTypeProperty.multi_select.map((item) => ({
          name: item.name,
          color: item.color || 'default',
        }))
      : mealTypeProperty?.type === 'select' && mealTypeProperty.select
        ? [
            {
              name: mealTypeProperty.select.name,
              color: mealTypeProperty.select.color || 'default',
            },
          ]
        : []

  return {
    title:
      titleProperty?.title
        ?.map((item) => item.plain_text || '')
        .join('')
        .trim() || 'Untitled',
    icon: mapPageIcon(page.icon),
    rating,
    mealType,
  }
}

const isFullDatabasePage = (
  result:
    | PageObjectResponse
    | PartialPageObjectResponse
    | DataSourceObjectResponse
    | PartialDataSourceObjectResponse
): result is PageObjectResponse => result.object === 'page' && isFullPage(result)

type DatabaseRetrieve = Awaited<ReturnType<Client['databases']['retrieve']>>

export const getDataSourceIdFromDatabase = (database: DatabaseRetrieve): string => {
  if (!('data_sources' in database) || database.data_sources.length === 0)
    throw new Error('No data source found for this database.')
  const dataSourceId = database.data_sources[0]?.id
  if (!dataSourceId) throw new Error('Invalid data source id for this database.')
  return dataSourceId
}

/** Loads all pages sorted by Notion `last_edited_time` (newest first). */
export const queryAllPagesFromDataSource = async (
  notionClient: Client,
  dataSourceId: string
): Promise<PageObjectResponse[]> => {
  const pages: PageObjectResponse[] = []
  let nextCursor: string | undefined
  do {
    const response = await notionClient.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: nextCursor,
      page_size: 100,
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    })
    pages.push(...response.results.filter(isFullDatabasePage))
    nextCursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (nextCursor)
  return pages
}

export const getNotionCookingNoteByPageId = async (pageId: string): Promise<NotionNotePayload> => {
  const notionClient = getNotionClient()
  const pageResponse = await notionClient.pages.retrieve({ page_id: pageId })
  if (!isFullPage(pageResponse))
    throw new Error('Provided pageId is not a full Notion page response.')
  const row = normalizePageToDishRowForDetail(pageResponse)
  const blocks = await buildBlocksTree(notionClient, pageId)
  return {
    id: pageResponse.id,
    title: row.title,
    lastEditedTime: pageResponse.last_edited_time || new Date().toISOString(),
    icon: row.icon,
    topic: row.mealType,
    status: row.rating,
    priority: null,
    blocks,
  }
}

export const getNotionNoteByPageId = async (pageId: string): Promise<NotionNotePayload> => {
  const notionClient = getNotionClient()
  const pageResponse = await notionClient.pages.retrieve({ page_id: pageId })
  if (!isFullPage(pageResponse))
    throw new Error('Provided pageId is not a full Notion page response.')
  const blocks = await buildBlocksTree(notionClient, pageId)
  const meta = normalizePageToResourceRow(pageResponse)
  return {
    id: pageResponse.id,
    title: normalizePageTitle(pageResponse),
    lastEditedTime: pageResponse.last_edited_time || new Date().toISOString(),
    icon: mapPageIcon(pageResponse.icon),
    topic: meta.topic,
    status: meta.status,
    priority: meta.priority,
    blocks,
  }
}
