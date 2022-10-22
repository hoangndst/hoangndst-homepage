import * as React from 'react'
import { allBlogs } from 'contentlayer/generated'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { MDXComponents } from 'components/mdx-components'
import BlogLayout from 'components/layouts/blog'
import { getMember } from 'utils/get-all-members'
import Layout from 'components/layouts/page'
import { Container } from '@chakra-ui/react'

export default function Page({
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(blog.body.code)
  return (
    <Layout title={blog.frontMatter.title}>
      <Container
        minW={{ md: '50rem' }}
      >
        <BlogLayout frontmatter={blog.frontMatter}>
          <Component components={MDXComponents} />
        </BlogLayout>
      </Container>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = allBlogs
    .map((t: any) =>
      t._id.replace('blog/', '').replace('.mdx', '').replace('index', ''),
    )
    .map((id: any) => ({ params: { slug: [id.replace('blog/', '')] } }))

  return { paths: blogs, fallback: false }
}

export const getStaticProps = async (ctx: any) => {
  const params = Array.isArray(ctx.params.slug)
    ? ctx.params.slug
    : [ctx.params.slug]

  const blog = allBlogs.find((blog: any) => blog._id.includes(params.join('/')))
  const authorData = getMember(blog.frontMatter.author)
  blog.frontMatter.authorData = authorData

  return { props: { blog } }
}