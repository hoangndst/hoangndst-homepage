import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr'

export function MdxSource({ title, url }: { title: string; url: string }) {
  return (
    <a
      className="not-typeset my-2 inline-flex items-center gap-1.5 border-b border-border py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      {title}
      <ArrowUpRightIcon aria-hidden="true" className="size-3" />
    </a>
  )
}
