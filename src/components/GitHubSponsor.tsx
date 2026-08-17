import { Button } from '@/components/ui/button'

export default function GitHubSponsor() {
  return (
    <div className="flex items-center justify-center">
      <Button asChild variant="outline" size="sm">
        <a href="https://github.com/sponsors/hoangndst" target="_blank" rel="noopener noreferrer">
          <img
            src="/icons/github-sponsors-mono.svg"
            alt="GitHub Sponsors"
            className="h-4 w-4 dark:invert"
          />
          <span>Sponsor</span>
        </a>
      </Button>
    </div>
  )
}
