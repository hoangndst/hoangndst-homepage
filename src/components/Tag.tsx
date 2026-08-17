'use client'

import Link from 'next/link'
import { slug } from 'github-slugger'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  className?: string
}

const Tag = ({ text, className }: Props) => {
  return (
    <span className={cn('mr-1.5', className)}>
      <Badge asChild variant="secondary">
        <Link
          href={`/tags/${slug(text)}`}
          className="no-underline"
        >
          #{text}
        </Link>
      </Badge>
    </span>
  )
}

export default Tag
