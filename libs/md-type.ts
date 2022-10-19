export type frontmatter = {
  title: string,
  date: string,
  excerpt: string,
  tags: string[],
  cover_image: string
}

export type mdProps = {
  frontmatter: frontmatter,
  slug: string
}