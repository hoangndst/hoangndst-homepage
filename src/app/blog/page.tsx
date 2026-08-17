import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import { getPublishedPosts, getTagCounts } from '@/lib/content'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export const metadata: Metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = getPublishedPosts()
  const tagCounts = getTagCounts()
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
    <SectionContainer>
      <ListLayout
        posts={posts}
        tagCounts={tagCounts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All posts"
      />
    </SectionContainer>
  )
}
