import { getPostSource } from '@/lib/content'

type RouteProps = {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteProps) {
  const { slug: encodedSlug } = await params
  const slug = decodeURI(encodedSlug)
  const source = getPostSource(slug)

  if (!source) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(source, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Location': new URL(request.url).pathname,
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
