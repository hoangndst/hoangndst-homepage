'use client'

import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import SiteImage from '@/components/Image'
import { Skeleton } from '@/components/ui/skeleton'

interface SpotifyTrack {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

function SpotifyMark({ className = 'size-5' }: { className?: string }) {
  return (
    <SiteImage
      src="/icons/spotify-mono.svg"
      alt=""
      width={24}
      height={24}
      className={`${className} opacity-70 dark:invert`}
      aria-hidden="true"
    />
  )
}

function SpotifyStatus({ children }: { children: string }) {
  return (
    <div className="border-border/70 flex items-center justify-between gap-3 border-y py-3">
      <div className="flex min-w-0 items-center gap-2">
        <SpotifyMark className="size-4" />
        <span className="text-foreground text-xs font-medium">Spotify</span>
      </div>
      <span className="text-muted-foreground truncate text-xs">{children}</span>
    </div>
  )
}

export default function Spotify({ compact = false }: { compact?: boolean }) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    async function fetchTrack() {
      setLoading(true)
      try {
        const res = await fetch('/api/spotify')
        const data = await res.json()
        if (data.error === 'token_expired') {
          setTokenExpired(true)
          setTrack(null)
        } else if (data.error) {
          setTrack(null)
        } else {
          setTrack(data)
        }
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
      <div className="border-border/70 flex items-center gap-3 border-y py-3" aria-label="Loading Spotify status">
        <Skeleton className={compact ? 'size-9 shrink-0' : 'size-10 shrink-0'} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    )
  }

  if (tokenExpired) return <SpotifyStatus>Spotify is unavailable</SpotifyStatus>
  if (!track) return <SpotifyStatus>Not playing</SpotifyStatus>

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${track.title} by ${track.artist} on Spotify`}
      className={`group border-border/70 flex w-full items-center border-y transition-[color,background-color] hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${compact ? 'gap-2 py-2.5' : 'gap-3 py-3'}`}
    >
      <div className={`relative shrink-0 ${compact ? 'size-9' : 'size-10'}`}>
        <Image
          src={track.albumImageUrl}
          alt={`${track.title} album art`}
          className={`${compact ? 'size-9' : 'size-10'} object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10`}
          width={compact ? 36 : 40}
          height={compact ? 36 : 40}
          unoptimized
        />
        {track.isPlaying ? (
          <div className="bg-black/45 absolute inset-0 flex items-center justify-center">
            <PlayIcon className="size-3.5 text-white" weight="fill" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {track.title}
        </p>
        <p className="text-muted-foreground mt-0.5 truncate text-[11px] leading-relaxed">{track.artist}</p>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 whitespace-nowrap text-[10px] leading-none uppercase tracking-wide">
          {track.isPlaying ? (
            <PlayIcon className="text-primary size-2.5" weight="fill" aria-hidden="true" />
          ) : (
            <PauseIcon className="text-muted-foreground size-2.5" weight="fill" aria-hidden="true" />
          )}
          {track.isPlaying ? 'Now playing' : 'Recently played'}
        </p>
      </div>
      {!compact && (
        <SpotifyMark className="size-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
      )}
    </a>
  )
}
