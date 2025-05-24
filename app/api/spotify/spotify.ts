const client_id = process.env.SPOTIFY_CLIENT_ID!
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || ''

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

export async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })
  const data = await response.json()
  return data.access_token
}

export async function getNowPlayingOrLastPlayed(access_token: string) {
  // Try now playing
  let response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })

  if (response.status === 204 || response.status > 400) {
    // Not playing, get last played
    response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 10 },
    })
    const data = await response.json()
    if (data && data.items && data.items.length > 0) {
      const track = data.items[0].track
      return {
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
      }
    }
    return null
  } else {
    const data = await response.json()
    if (!data.item) return null
    return {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
      album: data.item.album.name,
      albumImageUrl: data.item.album.images[0]?.url,
      songUrl: data.item.external_urls.spotify,
    }
  }
}
