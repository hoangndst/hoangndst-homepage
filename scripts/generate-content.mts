import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import GithubSlugger, { slug as githubSlug } from 'github-slugger'
import readingTime from 'reading-time'
import { z } from 'zod'
import type {
  AuthorMeta,
  PostLayoutKey,
  PostMeta,
  SearchDocument,
  TalkMeta,
  TocItem,
} from '../src/lib/content/types'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'src', 'data')
const blogDir = path.join(dataDir, 'blog')
const authorsDir = path.join(dataDir, 'authors')
const talksDir = path.join(dataDir, 'talks')

const generatedDir = path.join(rootDir, 'src', 'lib', 'content', 'generated')
const generatedTmpDir = path.join(rootDir, 'src', 'lib', 'content', 'generated.tmp')
const generatedBackupDir = path.join(rootDir, 'src', 'lib', 'content', 'generated.bak')

const publicGeneratedDir = path.join(rootDir, 'public', 'generated')
const publicGeneratedTmpDir = path.join(rootDir, 'public', 'generated.tmp')
const publicGeneratedBackupDir = path.join(rootDir, 'public', 'generated.bak')

const POST_LAYOUTS: PostLayoutKey[] = ['PostLayout', 'PostSimple', 'PostBanner']

const imageFieldSchema = z
  .union([z.string().min(1), z.array(z.string().min(1))])
  .transform((value) => (Array.isArray(value) ? value : [value]))

const PostFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    summary: z.string().optional(),
    images: imageFieldSchema.optional(),
    authors: z.array(z.string().min(1)).default(['default']),
    layout: z.enum(POST_LAYOUTS).default('PostLayout'),
    draft: z.boolean().default(false),
  })
  .strict()

const AuthorFrontmatterSchema = z
  .object({
    name: z.string().min(1),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    email: z.string().optional(),
    x: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  })
  .strict()

const TalkFrontmatterSchema = z
  .object({
    event: z.string().min(1),
    title: z.string().min(1),
    date: z.coerce.date(),
    summary: z.string().optional(),
    url: z.string().url(),
    image: z.string().optional(),
  })
  .strict()

const isUrlSafeSlug = (slug: string) => /^[A-Za-z0-9][A-Za-z0-9/_-]*$/.test(slug)

const toPosix = (value: string) => value.split(path.sep).join('/')

const toDateString = (value: Date) => value.toISOString().slice(0, 10)

const extractToc = (mdxBody: string): TocItem[] => {
  const toc: TocItem[] = []
  const slugger = new GithubSlugger()
  const lines = mdxBody.split(/\r?\n/)
  let inFence = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inFence = !inFence
      continue
    }

    if (inFence) {
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(trimmed)
    if (!headingMatch) {
      continue
    }

    const depth = headingMatch[1].length
    const value = headingMatch[2]
      .replace(/`/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .trim()

    if (!value) {
      continue
    }

    toc.push({
      value,
      url: `#${slugger.slug(value)}`,
      depth,
    })
  }

  return toc
}

const extractSearchText = (mdxBody: string) =>
  mdxBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/[>*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const collectMdxFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(entryPath)))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(entryPath)
    }
  }

  return files.sort((a, b) => a.localeCompare(b))
}

const findDuplicates = (values: string[]) => {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) {
      dupes.add(value)
    }
    seen.add(value)
  }
  return [...dupes].sort((a, b) => a.localeCompare(b))
}

const assertNoDuplicates = (typeName: string, values: string[]) => {
  const duplicates = findDuplicates(values)
  if (duplicates.length > 0) {
    throw new Error(`${typeName} has duplicate slugs: ${duplicates.join(', ')}`)
  }
}

const directoryExists = async (targetPath: string) => {
  try {
    const stats = await fs.stat(targetPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

const replaceDirectoryAtomically = async (tmpDir: string, targetDir: string, backupDir: string) => {
  await fs.rm(backupDir, { recursive: true, force: true })
  const hasTarget = await directoryExists(targetDir)
  if (hasTarget) {
    await fs.rename(targetDir, backupDir)
  }

  try {
    await fs.rename(tmpDir, targetDir)
    await fs.rm(backupDir, { recursive: true, force: true })
  } catch (error) {
    if (await directoryExists(backupDir)) {
      await fs.rename(backupDir, targetDir)
    }
    throw error
  }
}

const writeFile = async (targetPath: string, content: string) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, content, 'utf8')
}

const toSourceAlias = (sourcePath: string) =>
  sourcePath.startsWith('src/') ? sourcePath.slice(4) : sourcePath

const toTypeScriptConst = (value: unknown) => JSON.stringify(value, null, 2)

const main = async () => {
  const blogFiles = await collectMdxFiles(blogDir)
  const authorFiles = await collectMdxFiles(authorsDir)
  const talkFiles = await collectMdxFiles(talksDir)

  const parsedPosts = await Promise.all(
    blogFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      const frontmatter = PostFrontmatterSchema.parse(data)
      const slug = toPosix(path.relative(blogDir, filePath)).replace(/\.mdx$/, '')

      if (!isUrlSafeSlug(slug)) {
        throw new Error(`Post slug is not URL-safe: ${slug}`)
      }

      const reading = readingTime(content)

      const post: PostMeta = {
        slug,
        title: frontmatter.title,
        date: toDateString(frontmatter.date),
        lastmod: frontmatter.lastmod ? toDateString(frontmatter.lastmod) : undefined,
        summary: frontmatter.summary,
        tags: [...frontmatter.tags].sort((a, b) => a.localeCompare(b)),
        authors: [...frontmatter.authors].sort((a, b) => a.localeCompare(b)),
        images: frontmatter.images,
        layout: frontmatter.layout,
        draft: frontmatter.draft,
        readingTime: {
          text: reading.text,
          minutes: reading.minutes,
        },
        toc: extractToc(content),
        path: `blog/${slug}`,
        filePath: `blog/${slug}.mdx`,
      }

      return {
        post,
        searchText: extractSearchText(content),
        sourcePath: toPosix(path.relative(rootDir, filePath)),
      }
    })
  )

  const parsedAuthors = await Promise.all(
    authorFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      const frontmatter = AuthorFrontmatterSchema.parse(data)
      const slug = toPosix(path.relative(authorsDir, filePath)).replace(/\.mdx$/, '')

      if (!isUrlSafeSlug(slug)) {
        throw new Error(`Author slug is not URL-safe: ${slug}`)
      }

      const author: AuthorMeta = {
        slug,
        ...frontmatter,
      }

      return {
        author,
        hasBody: content.trim().length > 0,
        sourcePath: toPosix(path.relative(rootDir, filePath)),
      }
    })
  )

  const parsedTalks = await Promise.all(
    talkFiles.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data } = matter(source)
      const frontmatter = TalkFrontmatterSchema.parse(data)
      const slug = toPosix(path.relative(talksDir, filePath)).replace(/\.mdx$/, '')

      if (!isUrlSafeSlug(slug)) {
        throw new Error(`Talk slug is not URL-safe: ${slug}`)
      }

      const talk: TalkMeta = {
        slug,
        event: frontmatter.event,
        title: frontmatter.title,
        date: toDateString(frontmatter.date),
        summary: frontmatter.summary,
        url: frontmatter.url,
        image: frontmatter.image,
      }

      return {
        talk,
        sourcePath: toPosix(path.relative(rootDir, filePath)),
      }
    })
  )

  const posts = parsedPosts.map((item) => item.post).sort((a, b) => a.slug.localeCompare(b.slug))
  const authors = parsedAuthors
    .map((item) => item.author)
    .sort((a, b) => a.slug.localeCompare(b.slug))
  const talks = parsedTalks.map((item) => item.talk).sort((a, b) => a.slug.localeCompare(b.slug))

  assertNoDuplicates(
    'Posts',
    posts.map((post) => post.slug)
  )
  assertNoDuplicates(
    'Authors',
    authors.map((author) => author.slug)
  )
  assertNoDuplicates(
    'Talks',
    talks.map((talk) => talk.slug)
  )

  const authorSlugSet = new Set(authors.map((author) => author.slug))
  for (const post of posts) {
    for (const authorSlug of post.authors) {
      if (!authorSlugSet.has(authorSlug)) {
        throw new Error(`Post "${post.slug}" references missing author "${authorSlug}"`)
      }
    }
  }

  const publishedPosts = posts
    .filter((post) => !post.draft)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const searchTextBySlug = new Map(parsedPosts.map((item) => [item.post.slug, item.searchText]))
  const searchIndex: SearchDocument[] = publishedPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    tags: post.tags,
    content: searchTextBySlug.get(post.slug),
  }))

  const tags = publishedPosts.reduce<Record<string, number>>((accumulator, post) => {
    for (const tag of post.tags) {
      const formattedTag = githubSlug(tag)
      accumulator[formattedTag] = (accumulator[formattedTag] || 0) + 1
    }
    return accumulator
  }, {})

  const orderedTags = Object.keys(tags)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, number>>((accumulator, key) => {
      accumulator[key] = tags[key]
      return accumulator
    }, {})

  await fs.rm(generatedTmpDir, { recursive: true, force: true })
  await fs.rm(publicGeneratedTmpDir, { recursive: true, force: true })
  await fs.mkdir(generatedTmpDir, { recursive: true })
  await fs.mkdir(publicGeneratedTmpDir, { recursive: true })

  const manifestTs = `import type { AuthorMeta, PostMeta, TalkMeta } from '@/lib/content/types'

export const posts = ${toTypeScriptConst(posts)} satisfies PostMeta[]
export const authors = ${toTypeScriptConst(authors)} satisfies AuthorMeta[]
export const talks = ${toTypeScriptConst(talks)} satisfies TalkMeta[]
`

  const postLoadersTs = `export const postLoaders = {
${parsedPosts
  .sort((a, b) => a.post.slug.localeCompare(b.post.slug))
  .map(
    (item) =>
      `  ${JSON.stringify(item.post.slug)}: () => import(${JSON.stringify(`@/${toSourceAlias(item.sourcePath)}`)}),`
  )
  .join('\n')}
} as const

export type PostSlug = keyof typeof postLoaders

export function hasPostLoader(slug: string): slug is PostSlug {
  return slug in postLoaders
}
`

  const authorLoadersTs = `export const authorLoaders = {
${parsedAuthors
  .filter((author) => author.hasBody)
  .sort((a, b) => a.author.slug.localeCompare(b.author.slug))
  .map(
    (item) =>
      `  ${JSON.stringify(item.author.slug)}: () => import(${JSON.stringify(`@/${toSourceAlias(item.sourcePath)}`)}),`
  )
  .join('\n')}
} as const

export type AuthorSlug = keyof typeof authorLoaders

export function hasAuthorLoader(slug: string): slug is AuthorSlug {
  return slug in authorLoaders
}
`

  await writeFile(path.join(generatedTmpDir, 'manifest.ts'), manifestTs)
  await writeFile(path.join(generatedTmpDir, 'post-loaders.ts'), postLoadersTs)
  await writeFile(path.join(generatedTmpDir, 'author-loaders.ts'), authorLoadersTs)

  await writeFile(
    path.join(publicGeneratedTmpDir, 'search.json'),
    `${JSON.stringify(searchIndex, null, 2)}\n`
  )
  await writeFile(
    path.join(publicGeneratedTmpDir, 'tags.json'),
    `${JSON.stringify(orderedTags, null, 2)}\n`
  )

  await replaceDirectoryAtomically(generatedTmpDir, generatedDir, generatedBackupDir)
  await replaceDirectoryAtomically(
    publicGeneratedTmpDir,
    publicGeneratedDir,
    publicGeneratedBackupDir
  )

  console.log(
    `Content generated: ${posts.length} posts, ${authors.length} authors, ${talks.length} talks -> src/lib/content/generated and public/generated`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
