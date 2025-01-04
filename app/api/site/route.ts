import siteMetadata from '@/data/siteMetadata'

const handler = async () => {
  return Response.json(siteMetadata, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
