'use client'

import Giscus from '@giscus/react'
import { useTheme } from '@/components/ThemeProvider'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const { resolvedTheme } = useTheme()
  const provider = siteMetadata.comments?.provider
  const config = siteMetadata.comments?.giscusConfig

  if (provider !== 'giscus' || !config) {
    return null
  }

  const currentTheme =
    resolvedTheme === 'dark' ? config.darkTheme || 'dark' : config.theme || 'light'

  return (
    <Giscus
      key={resolvedTheme}
      id="comments"
      repo={config.repo as `${string}/${string}`}
      repoId={config.repositoryId}
      category={config.category}
      categoryId={config.categoryId}
      mapping={config.mapping as 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'}
      term={config.mapping === 'specific' ? slug : undefined}
      strict="0"
      reactionsEnabled={config.reactions as '0' | '1'}
      emitMetadata={config.metadata as '0' | '1'}
      inputPosition="top"
      theme={config.themeURL || currentTheme}
      lang={config.lang || 'en'}
      loading="lazy"
    />
  )
}
