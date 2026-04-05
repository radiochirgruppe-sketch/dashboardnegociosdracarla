import { useCallback } from 'react'
import { useAutoFetch } from './useAutoFetch'

export const CHANNEL_ID = 'UCdIaqlE_pylO1JK4hJC9KGQ'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE    = 'https://www.googleapis.com/youtube/v3'

async function fetchChannel() {
  // 1. Dados do canal
  const chRes = await fetch(
    `${BASE}/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
  )
  if (!chRes.ok) throw new Error(`YouTube channels: ${chRes.status}`)
  const chJson  = await chRes.json()
  const stats   = chJson.items?.[0]?.statistics ?? {}
  const snippet = chJson.items?.[0]?.snippet    ?? {}

  // 2. Últimos 8 vídeos
  const srRes = await fetch(
    `${BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=8&order=date&type=video&key=${API_KEY}`
  )
  if (!srRes.ok) throw new Error(`YouTube search: ${srRes.status}`)
  const srJson   = await srRes.json()
  const videoIds = (srJson.items ?? []).map(v => v.id.videoId).filter(Boolean).join(',')

  let recentVideos = []
  if (videoIds) {
    const vRes = await fetch(
      `${BASE}/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
    )
    if (vRes.ok) {
      const vJson = await vRes.json()
      recentVideos = (vJson.items ?? []).map(v => ({
        id:          v.id,
        title:       v.snippet?.title,
        views:       Number(v.statistics?.viewCount   ?? 0),
        likes:       Number(v.statistics?.likeCount   ?? 0),
        comments:    Number(v.statistics?.commentCount ?? 0),
        publishedAt: v.snippet?.publishedAt?.split('T')[0],
      }))
    }
  }

  return {
    channelTitle:  snippet.title ?? 'Medicina Simbólica',
    subscribers:   Number(stats.subscriberCount ?? 0),
    totalViews:    Number(stats.viewCount        ?? 0),
    videoCount:    Number(stats.videoCount       ?? 0),
    recentVideos,
  }
}

export function useYouTube() {
  const fetcher = useCallback(fetchChannel, [])

  return useAutoFetch('youtube', fetcher, {
    ttl:       60 * 60_000,   // cache de 1 h (dados mudam mais lentamente)
    refreshMs: 60 * 60_000,   // auto-refresh a cada 1 h
    enabled:   !!API_KEY,
  })
}
