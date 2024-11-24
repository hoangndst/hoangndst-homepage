'use client'

import React, { useEffect, useState } from 'react'
import Link from '@/components/Link'
import type { Talks } from 'contentlayer/generated'
import { allTalks } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const Talk = () => {
  const [talkStatuses, setTalkStatuses] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const calculateStatuses = () => {
      const statuses: { [key: string]: boolean } = {}
      allTalks.forEach((talk) => {
        statuses[talk.event] = new Date(talk.date) > new Date()
      })
      setTalkStatuses(statuses)
    }

    calculateStatuses()
  }, [])

  return (
    <div className="dark:text-grey text-gray flex flex-col items-center justify-center pb-12 pt-12">
      <p className="text-s text-gray dark:text-gray pb-12 leading-7 md:mt-5">
        <Link href="/about">Checkout my latest conference talks 🎤</Link>
      </p>
      <ul className="">
        {allTalks
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (descending)
          .map((talk: Talks) => {
            return (
              <li key={talk.event} className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <Link
                    href={talk.url || '#'}
                    className="text-xl font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {talk.event}
                  </Link>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:ml-2 sm:mt-0">
                    <span>
                      🗓️{' '}
                      <time suppressHydrationWarning dateTime={talk.date}>
                        {formatDate(talk.date, siteMetadata.locale)}
                      </time>
                    </span>
                    <span className="ml-2">
                      {talkStatuses[talk.event] ? (
                        <span className="text-blue-500">🔥 Upcoming</span>
                      ) : (
                        <span className="text-green-500">Finished</span>
                      )}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default Talk
