import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 flex min-h-16 w-full rounded-none border bg-transparent px-2.5 py-2 text-xs outline-none transition-colors focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
