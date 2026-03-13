import Link from '@/components/Link'
export default function WorkBadge() {
  return (
    <div className="ml-1.5 sm:ml-2">
      <Link href={'/about'}>
        <div className="focus:ring-ring text-primary ml-0 inline-flex max-w-full items-center rounded-full border border-primary-500 bg-transparent px-2 py-0.5 text-[11px] font-medium backdrop-blur-md transition-colors duration-150 hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-0 md:ml-0">
          <div
            className="mr-1 flex aspect-square h-3 w-3 animate-pulse rounded-full bg-green-500/50 dark:bg-green-400/50"
            aria-hidden="true"
          >
            <div className="m-auto h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
          </div>
          <span className="inline whitespace-nowrap">#OpenToWork</span>
        </div>
      </Link>
    </div>
  )
}
