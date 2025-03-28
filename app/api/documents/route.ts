import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

function formatFileSize(bytes, decimalPoint) {
  if (bytes == 0) return '0 Bytes'
  const k = 1000,
    dm = decimalPoint || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export async function GET() {
  const bucketName = 'hoangndst'
  const customEndpoint = 'https://os.hoangndst.com'

  // Create unauthenticated S3 client with custom endpoint
  const s3 = new S3Client({
    endpoint: customEndpoint,
    credentials: {
      accessKeyId: '',
      secretAccessKey: '',
    },
    forcePathStyle: true,
    region: 'vn-central-1',
    signer: {
      async sign(req) {
        return req
      },
    },
  })

  try {
    // List objects in the public bucket
    const command = new ListObjectsV2Command({ Bucket: bucketName })
    const response = await s3.send(command)
    // filter object: key starts with 'documents/'
    const filteredContents = response.Contents?.filter((item) => item.Key?.startsWith('document/'))
    // get object info
    const objectsInfo = filteredContents?.map((item) => {
      return {
        name: item.Key?.split('/').pop()?.split('.')[0],
        description: item.Key?.split('/')[1],
        downloadUrl: `${customEndpoint}/${bucketName}/${item.Key}`,
        lastModified: item.LastModified,
        size: formatFileSize(item.Size, 2),
      }
    })

    // Sort objects by last modified date
    objectsInfo?.sort((a, b) => {
      return new Date(b.lastModified ?? 0).getTime() - new Date(a.lastModified ?? 0).getTime()
    })

    return NextResponse.json({
      message: 'Objects retrieved successfully',
      objects: objectsInfo,
    })
  } catch (error) {
    console.error('Error listing objects:', error)
    return NextResponse.json({ error: 'Failed to list objects' }, { status: 500 })
  }
}
