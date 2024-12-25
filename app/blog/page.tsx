import ListLayout from '@/layouts/ListLayoutWithTags'
import { getBlogs } from '@/lib/blog'
import { getTagData } from '@/lib/tag'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const posts = await getBlogs()
  const tagData = await getTagData()
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      tags={tagData}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
