import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { authors, posts } from '../src/lib/content/generated/manifest'
import { postLoaders } from '../src/lib/content/generated/post-loaders'

const rootDir = process.cwd()

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) {
    throw new Error(message)
  }
}

const isUrlSafeSlug = (slug: string) => /^[A-Za-z0-9][A-Za-z0-9/_-]*$/.test(slug)

const main = async () => {
  const loaderSlugs = Object.keys(postLoaders)
  const loaderSlugSet = new Set(loaderSlugs)

  assert(posts.length === loaderSlugs.length, 'manifest post count must equal post loader count')
  assert(loaderSlugSet.size === loaderSlugs.length, 'post loader slugs must be unique')

  const publishedPosts = posts.filter((post) => !post.draft)
  for (const post of publishedPosts) {
    assert(loaderSlugSet.has(post.slug), `missing loader for published post "${post.slug}"`)
  }

  const authorSlugSet = new Set(authors.map((author) => author.slug))
  for (const post of posts) {
    for (const authorSlug of post.authors) {
      assert(
        authorSlugSet.has(authorSlug),
        `missing author "${authorSlug}" referenced by "${post.slug}"`
      )
    }
  }

  for (const post of posts) {
    assert(isUrlSafeSlug(post.slug), `post slug is not URL-safe: ${post.slug}`)
  }

  const searchJsonPath = path.join(rootDir, 'public', 'generated', 'search.json')
  const tagsJsonPath = path.join(rootDir, 'public', 'generated', 'tags.json')

  const searchRaw = await readFile(searchJsonPath, 'utf8')
  const tagsRaw = await readFile(tagsJsonPath, 'utf8')

  const searchDocs = JSON.parse(searchRaw) as Array<{ slug: string }>
  const tagsData = JSON.parse(tagsRaw) as Record<string, number>

  const draftSlugSet = new Set(posts.filter((post) => post.draft).map((post) => post.slug))
  for (const document of searchDocs) {
    assert(
      !draftSlugSet.has(document.slug),
      `draft post leaked into search index: ${document.slug}`
    )
  }

  assert(
    typeof tagsData === 'object' && !Array.isArray(tagsData),
    'tags.json must be an object map'
  )

  console.log(
    `content:check passed (${posts.length} posts, ${publishedPosts.length} published, ${authors.length} authors)`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
