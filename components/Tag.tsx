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
      className={`mr-3 rounded-full bg-gray-200 px-2 py-1 text-sm font-medium
                 uppercase text-primary-500 hover:text-primary-600 dark:bg-gray-700 dark:hover:text-primary-400 ${className ?? ''}`}
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
