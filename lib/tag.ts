import siteMetadata from '@/data/siteMetadata'

type TagResponse = {
  data: Record<string, number>
}

export async function getTags(): Promise<Record<string, number>> {
  const response = await fetch(`${siteMetadata.siteUrl}/api/tags`)
  if (!response.ok) {
    return {}
  }
  const tagData = (await response.json()) as TagResponse
  return tagData.data
}
