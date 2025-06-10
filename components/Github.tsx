'use client'
import { useTheme } from 'next-themes'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { type FunctionComponent, useCallback, useEffect, useState } from 'react'
import Calendar, { type Props as ActivityCalendarProps } from 'react-activity-calendar'

// Adopted from https://github.com/grubersjoe/react-github-calendar
// Copyright (c) 2019 Jonathan Gruber, MIT License

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
  username: string
}

async function fetchCalendarData(username: string): Promise<ApiResponse> {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`)
  const data: ApiResponse | ApiErrorResponse = await response.json()

  if (!response.ok) {
    throw Error(
      `Fetching GitHub contribution data for "${username}" failed: ${
        (data as ApiErrorResponse).error
      }`
    )
  }

  return data as ApiResponse
}

const GithubCalendar: FunctionComponent<Props> = ({ username, ...props }) => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { theme } = useTheme()

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchCalendarData(username)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [username])

  useEffect(fetchData, [fetchData])

  if (error) {
    return (
      <div className="h-[180px] w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
    )
  }

  if (loading || !data) {
    return (
      <div className="h-[180px] w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-gray dark:text-gray text-xs leading-7 md:mt-5">
        <Link
          href={siteMetadata.github}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          My Github Contributions
        </Link>
      </p>
      <div className="[&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 mx-auto hidden w-fit max-w-full overflow-x-auto sm:block">
        <Calendar
          data={getFullYearContributions(data.contributions, 350)}
          theme={{
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          }}
          colorScheme={theme === 'dark' ? 'dark' : 'light'}
          blockSize={15}
          blockMargin={5}
          blockRadius={2}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
      <div className="[&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 mx-auto w-fit max-w-full overflow-x-auto sm:hidden">
        <Calendar
          data={getFullYearContributions(data.contributions, 120)}
          theme={{
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          }}
          colorScheme={theme === 'dark' ? 'dark' : 'light'}
          blockSize={15}
          blockMargin={5}
          blockRadius={2}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
    </div>
  )
}

interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<Activity>
}

interface ApiErrorResponse {
  error: string
}

const getFullYearContributions = (contributions: Activity[], days: number = 365): Activity[] => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days + 1)

  const activityMap = new Map(contributions.map((a) => [a.date, a]))
  const result: Activity[] = []

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    if (activityMap.has(dateStr)) {
      result.push(activityMap.get(dateStr)!)
    } else {
      result.push({ date: dateStr, count: 0, level: 0 })
    }
  }
  return result
}

export default GithubCalendar
