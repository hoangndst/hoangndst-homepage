import { NextResponse } from 'next/server'
import { getNotionNoteByPageId } from '@/lib/notion'

type RouteContext = {
  params: Promise<{ pageId: string }>
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { pageId } = await context.params
    const note = await getNotionNoteByPageId(pageId)
    return NextResponse.json({ note })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch note from Notion.'
    console.error('[api/notes/[pageId]] fetch failed:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
