'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'
  const CurrentThemeIcon = isDark ? MoonIcon : SunIcon

  return (
    <div className="mr-3 flex items-center sm:mr-5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        <CurrentThemeIcon />
      </Button>
    </div>
  )
}

export default ThemeSwitch
