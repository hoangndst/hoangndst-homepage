import { NextResponse } from 'next/server'
import { getNotionDatabaseTable } from '@/lib/notionTable'

export async function GET() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Missing NOTION_DATABASE_ID environment variable.' },
        { status: 500 }
      )
    }
    const { columns, rows, description } = await getNotionDatabaseTable(databaseId)
    return NextResponse.json({ columns, rows, description })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch resources from Notion.'
    console.error('[api/notes] fetch failed:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
