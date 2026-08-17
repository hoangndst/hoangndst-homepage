import { NextResponse } from 'next/server'
import { getNotionCookingNoteByPageId } from '@/lib/notion'

type RouteContext = {
  params: Promise<{ pageId: string }>
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { pageId } = await context.params
    const note = await getNotionCookingNoteByPageId(pageId)
    return NextResponse.json({ note })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch dish page from Notion.'
    console.error('[api/cooking/[pageId]] fetch failed:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
