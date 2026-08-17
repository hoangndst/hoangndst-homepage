import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getNowPlayingOrLastPlayed } from './spotify'

export async function GET(req: NextRequest) {
  try {
    const access_token = await getAccessToken()
    const track = await getNowPlayingOrLastPlayed(access_token)
    return NextResponse.json(track)
  } catch (e) {
    const isTokenExpired = e instanceof Error && e.message === 'SPOTIFY_REFRESH_TOKEN_EXPIRED'
    return NextResponse.json(
      { error: isTokenExpired ? 'token_expired' : 'Failed to fetch Spotify data' },
      { status: 500 }
    )
  }
}
