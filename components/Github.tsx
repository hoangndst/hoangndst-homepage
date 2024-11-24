'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

const Github = () => {
  const [svgContent, setSvgContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSVGContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/ghchart`)
        const svgText = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(svgText, 'image/svg+xml')

        const rectElements = xmlDoc.querySelectorAll('rect[style*="fill:#EEEEEE;"]')

        rectElements.forEach((rectElement) => {
          rectElement.setAttribute('style', 'fill:#161b22;shape-rendering:crispedges;')
        })

        const modifiedSvgText = new XMLSerializer().serializeToString(xmlDoc)

        setSvgContent(`data:image/svg+xml;base64,${btoa(modifiedSvgText)}`)
      } catch (error) {
        console.error('Error fetching SVG:', error)
      }
      setLoading(false)
    }

    fetchSVGContent()
  }, [])

  if (loading || svgContent === '') {
    return (
      <div className="dark:text-grey text-gray flex flex-col items-center justify-center">
        <p className="text-gray dark:text-gray text-xs leading-7 md:mt-5">
          <Link
            href="/about"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            My Github Contributions
          </Link>
        </p>

        {/* Skeleton Loader */}
        <div className="h-[180px] w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
      </div>
    )
  }

  return (
    <div className="dark:text-grey text-gray flex flex-col items-center justify-center">
      <p className="text-gray dark:text-gray text-xs leading-7 md:mt-5">
        <Link
          href={siteMetadata.github}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          My Github Contributions
        </Link>
      </p>
      <Image width={900} height={200} src={svgContent} alt="My Github Contributions" />
    </div>
  )
}

export default Github
