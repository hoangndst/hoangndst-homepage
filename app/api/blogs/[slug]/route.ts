async function handler(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const visionToken = process.env.VISION_TOKEN
  if (!visionToken) {
    return Response.json('VISION_TOKEN is not set', {
      status: 500,
    })
  }
  const response = await fetch(`https://vision.hoangndst.com/api/v1/blogs/path/${slug}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${visionToken}`,
    },
    cache: 'no-store',
  })
  const post = await response.json()
  return Response.json(post, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
