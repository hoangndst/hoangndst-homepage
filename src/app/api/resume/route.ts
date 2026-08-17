import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client, getS3Config } from '@/lib/s3'

export const dynamic = 'force-dynamic'

const resumeKey = 'resume/resume-steven-nguyen.pdf'

export async function GET() {
  try {
    const { bucket } = getS3Config()
    const object = await getS3Client().send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: resumeKey,
      })
    )

    if (!object.Body) {
      return new Response('Resume not found', { status: 404 })
    }

    return new Response(object.Body.transformToWebStream(), {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Disposition': 'inline; filename="resume-steven-nguyen.pdf"',
        ...(object.ContentLength === undefined
          ? {}
          : { 'Content-Length': String(object.ContentLength) }),
        'Content-Type': object.ContentType || 'application/pdf',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Failed to load resume from object storage:', error)
    return new Response('Unable to load resume', { status: 502 })
  }
}
