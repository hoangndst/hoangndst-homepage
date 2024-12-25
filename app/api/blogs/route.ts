import { getBlogs } from '@/lib/blog'

const handler = async () => {
  const posts = await getBlogs()
  const body = JSON.stringify(posts)

  return new Response(body, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
