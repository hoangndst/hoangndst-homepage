import type { MDXComponents } from 'mdx/types'
import { Children, type ComponentProps } from 'react'
import Link from '@/components/Link'
import Youtube from '@/components/Youtube'
import { Mermaid } from '@/components/Mermaid'
import siteMetadata from '@/data/siteMetadata'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from '@/components/Image'
import { MdxCallout } from '@/components/blog/MdxCallout'
import { MdxCitation } from '@/components/blog/MdxCitation'
import { MdxFigure } from '@/components/blog/MdxFigure'
import { MdxSource } from '@/components/blog/MdxSource'

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

const MDXImage = ({ alt, ...props }: ComponentProps<'img'>) => (
  <Image
    sizes="(min-width: 768px) 70ch, 100vw"
    style={{ width: '100%', height: 'auto' }}
    width={1400}
    height={800}
    {...(props as ComponentProps<typeof Image>)}
    alt={alt ?? ''}
  />
)

const MDXSectionHeading = ({ children, ...props }: ComponentProps<'h2'>) => {
  const headingText = Children.toArray(children)
    .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
    .join('')
  const hasManualNumber = /^\s*\d+(?:\.\d+)*(?:[.)]|:)?\s+/.test(headingText)

  return (
    <h2 {...props} data-manual-section={hasManualNumber ? 'true' : undefined}>
      {children}
    </h2>
  )
}

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
  Callout: MdxCallout,
  Citation: MdxCitation,
  Figure: MdxFigure,
  Source: MdxSource,
  TOCInline,
  BlogNewsletterForm,
  Youtube,
  Mermaid,
  a: Link,
  h2: MDXSectionHeading,
  table: MDXTable,
  img: MDXImage,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  }
}
