import Main from './Main'
import { getBlogs } from '@/lib/blog'

export default async function Page() {
  const posts = await getBlogs()
  return <Main posts={posts} />
}
