'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface SpotifyTrack {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

export default function Spotify() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrack() {
      setLoading(true)
      try {
        const res = await fetch('/api/spotify')
        const data = await res.json()
        setTrack(data)
      } catch {
        setTrack(null)
      } finally {
        setLoading(false)
      }
    }
    fetchTrack()
  }, [])

  if (loading) {
    return (
      <div className="mt-4 flex items-center space-x-2">
        <div className="h-10 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    )
  }

  if (!track) {
    return <div className="mt-4 text-sm text-gray-500">No track found.</div>
  }

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto mt-4 flex w-full max-w-xs items-center space-x-3 overflow-hidden rounded p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800 sm:max-w-sm md:max-w-md lg:max-w-full"
    >
      <Image
        src={track.albumImageUrl}
        alt={track.title}
        className="h-10 w-10 flex-shrink-0 rounded shadow"
        width={40}
        height={40}
        unoptimized
      />
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="truncate font-medium text-gray-900 dark:text-gray-100">{track.title}</div>
        <div className="truncate text-xs text-gray-500">
          {track.artist} &mdash; {track.album}
        </div>
        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
          {track.isPlaying ? 'Now Playing' : 'Recently Played'}
        </div>
      </div>
      {/* Spotify Logo SVG */}
      <svg
        className="h-6 w-6 flex-shrink-0"
        viewBox="0 0 496 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#1ed760"
          d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"
        />
        <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
      </svg>
    </a>
  )
}
