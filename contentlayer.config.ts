import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files'
import siteConfig from 'config/site-config.json'
import remarkSlug from 'remark-slug'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import { rehypeMdxCodeMeta } from 'utils/rehype-code-meta'

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
}

const Blogs = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    author: { type: 'string' },
    publishedDate: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        publishedDate: {
          raw: doc.publishedDate,
          iso: new Date(doc.publishedDate).toISOString(),
          text: new Date(doc.publishedDate).toDateString(),
        },
        author: doc.author,
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`,
      }),
    },
  },
}))

const contentLayerConfig = makeSource({
  contentDirPath: 'content',
  documentTypes: [Blogs],
  mdx: {
    rehypePlugins: [rehypeMdxCodeMeta],
    remarkPlugins: [remarkSlug, remarkGfm, remarkEmoji],
  },
})

export default contentLayerConfig