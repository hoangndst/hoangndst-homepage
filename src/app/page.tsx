import { getPublishedPosts } from '@/lib/content'
import Main from './Main'

export default async function Page() {
  return <Main posts={getPublishedPosts()} />
}
