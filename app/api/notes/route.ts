import { NextResponse } from 'next/server'
import { getNotionResources } from '@/lib/notion'

export async function GET() {
  try {
    const resources = await getNotionResources()
    return NextResponse.json({ resources })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch resources from Notion.'
    console.error('[api/notes] fetch failed:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
