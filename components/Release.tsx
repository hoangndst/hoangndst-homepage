'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const Release = () => {
  const [latestRelease, setLatestRelease] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <div className="fixed bottom-4 left-4">
      <button
        aria-label="Open Latest Release"
        onClick={() => window.open(`${siteMetadata.siteRepo}/releases`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all duration-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${
          isHovered ? 'w-32 px-2' : 'w-[30px]'
        } h-[30px]`}
      >
        {isHovered ? (
          <span className="inline truncate text-center text-sm">
            {latestRelease || 'Loading...'}
          </span>
        ) : (
          <svg
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path
              d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324"
              fill="#DE4C36"
            />
          </svg>
        )}
      </button>
    </div>
  )
}

export default Release
