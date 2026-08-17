import { z } from 'zod'

export const dynamic = 'force-dynamic'

const NewsletterPayloadSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

const jsonResponse = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })

const parseBody = async (request: Request) => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''

  if (contentType.includes('application/json')) {
    return request.json()
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const raw = await request.text()
    const data = new URLSearchParams(raw)
    return { email: data.get('email') }
  }

  if (contentType.includes('multipart/form-data')) {
    const data = await request.formData()
    return { email: data.get('email') }
  }

  return null
}

export async function POST(request: Request) {
  const body = await parseBody(request)
  if (!body) {
    return jsonResponse(415, {
      ok: false,
      message: 'Unsupported content type. Use JSON or form-encoded payload.',
    })
  }

  const parsed = NewsletterPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return jsonResponse(400, {
      ok: false,
      message: 'Invalid email address.',
    })
  }

  const buttondownApiKey = process.env.BUTTONDOWN_API_KEY
  if (!buttondownApiKey) {
    return jsonResponse(500, {
      ok: false,
      message: 'Newsletter service unavailable.',
    })
  }

  try {
    const upstreamResponse = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${buttondownApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: parsed.data.email }),
      signal: AbortSignal.timeout(8000),
    })

    if (upstreamResponse.ok || upstreamResponse.status === 409) {
      return jsonResponse(200, {
        ok: true,
        message: 'Check your inbox to confirm the subscription.',
      })
    }

    if (upstreamResponse.status >= 400 && upstreamResponse.status < 500) {
      return jsonResponse(400, {
        ok: false,
        message: 'Could not subscribe this email.',
      })
    }

    return jsonResponse(502, {
      ok: false,
      message: 'Newsletter provider unavailable.',
    })
  } catch {
    return jsonResponse(504, {
      ok: false,
      message: 'Newsletter request timed out.',
    })
  }
}
