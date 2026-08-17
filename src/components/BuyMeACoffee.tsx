import { Button } from '@/components/ui/button'

export default function BuyMeACoffee() {
  return (
    <div className="flex items-center justify-center">
      <Button asChild variant="outline" size="sm">
        <a href="https://www.buymeacoffee.com/hoangndst" target="_blank" rel="noopener noreferrer">
          <img
            src="/icons/buy-me-a-coffee-mono.svg"
            alt="Buy Me A Coffee"
            className="h-4 w-4 dark:invert"
          />
          <span>Buy me a coffee</span>
        </a>
      </Button>
    </div>
  )
}
