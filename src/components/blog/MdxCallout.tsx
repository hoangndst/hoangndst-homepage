import { CheckCircleIcon, InfoIcon, WarningIcon } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CalloutProps = {
  children: ReactNode
  title?: string
  type?: 'info' | 'warning' | 'success'
}

const icons = {
  info: InfoIcon,
  warning: WarningIcon,
  success: CheckCircleIcon,
}

export function MdxCallout({ children, title, type = 'info' }: CalloutProps) {
  const Icon = icons[type]

  return (
    <aside
      className={cn(
        'my-8 border-l-2 bg-muted/50 px-4 py-3 text-sm leading-relaxed',
        type === 'warning' && 'border-destructive',
        type === 'success' && 'border-primary',
        type === 'info' && 'border-foreground'
      )}
      role="note"
    >
      <div className="flex gap-3">
        <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <div className="min-w-0">
          {title && <p className="mb-1 font-semibold text-foreground">{title}</p>}
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </aside>
  )
}
