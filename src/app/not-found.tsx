import Link from '@/components/Link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start justify-start gap-6 md:mt-24 md:flex-row md:items-center md:justify-center">
      <div className="pb-8 pt-6">
        <h1 className="text-foreground font-heading md:border-r-border text-6xl font-bold leading-none tracking-tight md:border-r-2 md:px-6 md:text-8xl">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Sorry we couldn't find this page.
        </p>
        <p className="text-muted-foreground mb-8">
          But dont worry, you can find plenty of other things on our homepage.
        </p>
        <Button asChild>
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    </div>
  )
}
