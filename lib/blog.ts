import { compileMDX } from 'next-mdx-remote/rsc'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
import readingTime from 'reading-time'
import siteMetadata from '@/data/siteMetadata'
// Custom components
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from '@/components/Image'
import CustomLink from '@/components/Link'
import TableWrapper from '@/components/TableWrapper'
import { ReactNode } from 'react'

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

type BlogsTree = {
  data: [
    {
      id: string
      path: string
      raw_data: string
    },
  ]
}

type BlogTree = {
  data: {
    id: string
    path: string
    raw_data: string
  }
}

export async function getBlogContent(rawData: string): Promise<ReactNode> {
  if (rawData === '404: Not Found') {
    return undefined
  }
  const { content } = await compileMDX({
    source: rawData,
    components: {
      Image,
      a: CustomLink,
      pre: Pre,
      toc: TOCInline,
      table: TableWrapper,
      BlogNewsletterForm,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkExtractFrontmatter,
          remarkGfm,
          remarkCodeTitles,
          remarkMath,
          remarkImgToJsx,
          remarkAlert,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'prepend',
              headingProperties: {
                className: ['content-header'],
              },
              content: icon,
            },
          ],
          rehypeKatex,
          rehypeKatexNoTranslate,
          [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
          rehypePresetMinify,
        ],
      },
    },
  })
  return content
}

export async function convertBlog(name: string, rawData: string): Promise<Blog | undefined> {
  const { frontmatter } = await compileMDX<{
    type: 'Blog'
    title: string
    date: string
    tags: string[]
    lastmod?: string
    draft?: boolean
    summary?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images?: any
    authors?: string[]
    layout?: string
    bibliography?: string
    canonicalUrl?: string
  }>({
    source: rawData,
    options: {
      parseFrontmatter: true,
    },
  })
  const blog: Blog = {
    _id: name,
    type: 'Blog',
    title: frontmatter.title,
    date: frontmatter.date,
    tags: frontmatter.tags,
    lastmod: frontmatter.lastmod,
    draft: frontmatter.draft,
    summary: frontmatter.summary,
    images: frontmatter.images,
    authors: frontmatter.authors,
    layout: frontmatter.layout,
    rawData: rawData,
    readingTime: JSON.stringify(readingTime(rawData)),
    slug: name.replace(/\.mdx?$/, '').replace(/^.+?(\/)/, ''),
    filePath: name,
    path: `${name.replace(/\.mdx?$/, '')}`,
    toc: JSON.stringify(extractTocHeadings(rawData)),
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: frontmatter.title,
      datePublished: frontmatter.date,
      dateModified: frontmatter.lastmod || frontmatter.date,
      description: frontmatter.summary,
      image: frontmatter.images ? frontmatter.images[0] : siteMetadata.socialBanner,
      url: `${siteMetadata.siteUrl}/blog/${name.replace(/\.mdx?$/, '').replace(/^.+?(\/)/, '')}`,
    },
  }
  return blog
}

export async function getBlogs(): Promise<Blog[]> {
  const response = await fetch(`${siteMetadata.siteUrl}/api/blogs`)
  if (!response.ok) {
    return [] as Blog[]
  }
  const tree = (await response.json()) as BlogsTree
  const blogs = await Promise.all(
    tree.data.map(async (file) => {
      try {
        const blog = await convertBlog(file.path, file.raw_data)
        return blog as Blog
      } catch (error) {
        return null
      }
    })
  )

  const validBlogs: Blog[] = []
  for (const blog of blogs) {
    if (blog !== null) {
      validBlogs.push(blog)
    }
  }
  return sortBlogs(validBlogs) || []
}

export function sortBlogs(blogs: Blog[]) {
  return blogs.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const response = await fetch(`${siteMetadata.siteUrl}/api/blogs/${slug}`)
  if (!response.ok) {
    return undefined
  }
  const tree = (await response.json()) as BlogTree
  const blog = await convertBlog(tree.data.path, tree.data.raw_data)
  return blog
}
