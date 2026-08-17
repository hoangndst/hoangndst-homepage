import { ImageResponse } from 'next/og'
import { BlogOgImage } from '@/lib/og/BlogOgImage'

export const alt = 'Hoang Nguyen, software engineering and infrastructure notes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <BlogOgImage
      title="Software Engineering, Cloud Infrastructure, AI"
      summary="Notes from building things."
      section="Homepage"
    />,
    size
  )
}
