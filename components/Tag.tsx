import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
  className?: string
}

const Tag = ({ text, className }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={`mr-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-primary-600 transition-all duration-200 hover:bg-gray-200 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700 dark:hover:text-primary-300 ${className ?? ''}`}
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
