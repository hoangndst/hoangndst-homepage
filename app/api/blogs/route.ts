const handler = async () => {
  const visionToken = process.env.VISION_TOKEN
  if (!visionToken) {
    return Response.json('VISION_TOKEN is not set', {
      status: 500,
    })
  }
  const response = await fetch(`https://vision.hoangndst.com/api/v1/blogs`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${visionToken}`,
    },
    cache: 'no-store',
  })

  const posts = await response.json()
  if (!posts) {
    return new Response('Not found', {
      status: 404,
    })
  }
  return Response.json(posts, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
