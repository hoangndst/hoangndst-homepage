import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export default function PageTitle({ children, className }: Props) {
  return (
    <h1 className={cn('text-foreground font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl sm:leading-[1.1] md:text-5xl md:leading-[1.1]', className)}>
      {children}
    </h1>
  )
}
