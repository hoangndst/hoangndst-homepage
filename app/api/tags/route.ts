const handler = async () => {
  const visionToken = process.env.VISION_TOKEN
  if (!visionToken) {
    return Response.json('VISION_TOKEN is not set', {
      status: 500,
    })
  }
  const response = await fetch(`https://vision.hoangndst.com/api/v1/blogs/tags`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${visionToken}`,
    },
    cache: 'no-store',
  })
  const tagData = await response.json()
  if (!tagData) {
    return new Response('Not found', {
      status: 404,
    })
  }
  return Response.json(tagData, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
