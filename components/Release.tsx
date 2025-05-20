'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const Release = () => {
  const [latestRelease, setLatestRelease] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/hoangndst/hoangndst-homepage/releases'
        )
        const data = await response.json()
        if (data.length > 0) {
          const latestRelease = data[0].tag_name
          setLatestRelease(latestRelease)
        }
      } catch (error) {
        console.error('Error fetching latest release:', error)
      }
    }

    fetchLatestRelease()
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 hidden md:block">
      <button
        aria-label="Open Latest Release"
        onClick={() => window.open(`${siteMetadata.siteRepo}/releases`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center overflow-hidden shadow-lg transition-all duration-300
          ${isHovered ? 'w-44 rounded-2xl px-3 py-1' : 'h-[38px] w-[38px] justify-center rounded-full'}
          bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-[#181A20] dark:text-gray-100`}
        style={{ minHeight: '38px', minWidth: '38px' }}
      >
        <span className={`flex w-full items-center justify-center gap-2`}>
          <svg
            viewBox="0 0 98 96"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            />
          </svg>
          {isHovered && (
            <>
              <span className="inline truncate text-center text-xs font-medium text-gray-500 dark:text-gray-100">
                {latestRelease || 'Loading...'}
              </span>
              <span
                className="cursor-pointer px-1 text-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsVisible(false)
                }}
                aria-label="Close"
              >
                ×
              </span>
            </>
          )}
        </span>
      </button>
    </div>
  )
}

export default Release
