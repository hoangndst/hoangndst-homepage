import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getNowPlayingOrLastPlayed } from './spotify'

export async function GET(req: NextRequest) {
  try {
    const access_token = await getAccessToken()
    const track = await getNowPlayingOrLastPlayed(access_token)
    return NextResponse.json(track)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch Spotify data' }, { status: 500 })
  }
}
