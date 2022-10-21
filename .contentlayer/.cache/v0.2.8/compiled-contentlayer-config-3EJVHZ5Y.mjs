// contentlayer.config.ts
import {
  defineDocumentType,
  makeSource
} from "contentlayer/source-files";
import siteConfig from "config/site-config.json";
import remarkSlug from "remark-slug";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { rehypeMdxCodeMeta } from "utils/rehype-code-meta";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`
  }
};
var Blogs = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    author: { type: "string" },
    publishedDate: { type: "string" }
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: "json",
      resolve: (doc) => ({
        publishedDate: {
          raw: doc.publishedDate,
          iso: new Date(doc.publishedDate).toISOString(),
          text: new Date(doc.publishedDate).toDateString()
        },
        author: doc.author,
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`
      })
    }
  }
}));
var contentLayerConfig = makeSource({
  contentDirPath: "content",
  documentTypes: [Blogs],
  mdx: {
    rehypePlugins: [rehypeMdxCodeMeta],
    remarkPlugins: [remarkSlug, remarkGfm, remarkEmoji]
  }
});
var contentlayer_config_default = contentLayerConfig;
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-3EJVHZ5Y.mjs.map
