import https from 'https'
import fetch from 'node-fetch'

const handler = async () => {
  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL verification for this request
  })
  const res = await fetch('https://ghchart.hoangndst.com/178942/hoangndst', {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
    agent,
  })

  const svgText = await res.text()

  return new Response(svgText, {
    status: 200,
  })
}

export const revalidate = 86400

export { handler as GET }
