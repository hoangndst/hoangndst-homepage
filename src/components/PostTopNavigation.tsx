import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr'
import NextLink from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import ShareMenu from '@/components/blog/ShareMenu'

type AdjacentPost = {
  path: string
  title: string
}

type PostTopNavigationProps = {
  next?: AdjacentPost
  prev?: AdjacentPost
  path: string
  title: string
}

export default function PostTopNavigation({
  next,
  prev,
  path,
  title,
}: PostTopNavigationProps) {
  const url = `${siteMetadata.siteUrl}/${path}`
  const rawUrl = `/${path}/raw`

  return (
    <nav aria-label="Post navigation" className="flex shrink-0 items-center gap-1">
      <ShareMenu rawUrl={rawUrl} title={title} url={url} />
      {next && (
        <NextLink
          href={`/${next.path}`}
          aria-label={`Next post: ${next.title}`}
          title={`Next: ${next.title}`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 items-center justify-center transition-colors"
        >
          <CaretLeftIcon aria-hidden="true" className="size-4" weight="bold" />
        </NextLink>
      )}
      {prev && (
        <NextLink
          href={`/${prev.path}`}
          aria-label={`Previous post: ${prev.title}`}
          title={`Previous: ${prev.title}`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 items-center justify-center transition-colors"
        >
          <CaretRightIcon aria-hidden="true" className="size-4" weight="bold" />
        </NextLink>
      )}
    </nav>
  )
}
