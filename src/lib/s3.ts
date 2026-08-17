import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'

const getRequiredEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }
  return value
}

export const getS3Config = () => ({
  bucket: getRequiredEnv('S3_BUCKET'),
  endpoint: getRequiredEnv('S3_ENPOIND'),
  region: getRequiredEnv('S3_REGION'),
})

let client: S3Client | undefined

export const getS3Client = () => {
  if (!client) {
    const endpoint = getRequiredEnv('S3_ENPOIND')
    const region = getRequiredEnv('S3_REGION')

    client = new S3Client({
      endpoint,
      credentials: {
        accessKeyId: getRequiredEnv('S3_ACCESS_KEY_ID'),
        secretAccessKey: getRequiredEnv('S3_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
      region,
    })
  }

  return client
}
