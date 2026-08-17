import Link from '@/components/Link'
import { Badge } from '@/components/ui/badge'

export default function WorkBadge() {
  return (
    <Badge
      asChild
      variant="outline"
      className="border-primary/40 text-primary hover:bg-primary/10 ml-1.5 transition-colors sm:ml-2"
    >
      <Link href="/about" aria-label="Open to work status">
        <span className="relative inline-flex size-2">
          <span
            className="bg-primary/45 absolute inset-0 animate-pulse rounded-full"
            aria-hidden="true"
          />
          <span className="bg-primary relative m-auto size-1.5 rounded-full" aria-hidden="true" />
        </span>
        <span className="whitespace-nowrap hidden sm:inline">#OpenToWork</span>
      </Link>
    </Badge>
  )
}
