import type { ReactNode } from 'react'

export function MdxCitation({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      className="not-typeset align-super text-[0.7em] font-medium text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      [{children}]
    </a>
  )
}
