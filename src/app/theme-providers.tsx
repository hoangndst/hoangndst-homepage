'use client'

import { ThemeProvider } from '@/components/ThemeProvider'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>{children}</ThemeProvider>
  )
}
