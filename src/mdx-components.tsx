import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'
import Link from '@/components/Link'
import Youtube from '@/components/Youtube'
import { Mermaid } from '@/components/Mermaid'
import siteMetadata from '@/data/siteMetadata'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type TocItem = {
  value: string
  url: string
}

const TOCInline = ({ toc, indentDepth = false }: { toc?: TocItem[]; indentDepth?: boolean }) => {
  if (!toc?.length) return null

  return (
    <ul className="bg-card border-border my-4 flex flex-col gap-1 rounded-lg border p-4">
      {toc.map((heading) => (
        <li
          key={heading.url}
          className={cn(indentDepth && heading.url.split('#').length > 2 && 'ml-4')}
        >
          <a
            href={heading.url}
            className="text-muted-foreground hover:text-foreground rounded-sm text-sm underline-offset-4 hover:underline"
          >
            {heading.value}
          </a>
        </li>
      ))}
    </ul>
  )
}

const MDXTable = ({ children, ...props }: ComponentProps<'table'>) => (
  <div className="typeset-scroll">
    <table {...props}>{children}</table>
  </div>
)

const BlogNewsletterForm = ({
  title = 'Subscribe to newsletter',
}: {
  title?: string
  [key: string]: unknown
}) => {
  if (!siteMetadata.newsletter?.provider) return null

  return (
    <form
      action="/api/newsletter"
      method="post"
      className="bg-card border-border my-8 flex flex-col gap-3 rounded-lg border p-4"
    >
      <p className="m-0 text-sm font-medium">{title}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input type="email" name="email" required placeholder="your@email.com" className="w-full" />
        <Button type="submit">Subscribe</Button>
      </div>
    </form>
  )
}

const baseComponents: MDXComponents = {
  TOCInline,
  BlogNewsletterForm,
  Youtube,
  Mermaid,
  a: Link,
  table: MDXTable,
  img: (props) => <img {...props} />,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  }
}
