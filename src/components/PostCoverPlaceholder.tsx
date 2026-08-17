import { cn } from '@/lib/utils'

interface PostCoverPlaceholderProps {
  className?: string
}

export default function PostCoverPlaceholder({ className = '' }: PostCoverPlaceholderProps) {
  return <div aria-hidden="true" className={cn('post-cover-placeholder', className)} />
}
