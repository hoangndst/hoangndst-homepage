import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export async function getTagData(): Promise<any> {
  const response = await fetch(
    `https://raw.githubusercontent.com/hoangndst/hoangndst-homepage/blog/tag-data.json`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${serverRuntimeConfig.githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    }
  )
  if (!response.ok) {
    return undefined
  }
  const tagData = await response.json()
  if (tagData === null) {
    return {}
  }
  return tagData
}
