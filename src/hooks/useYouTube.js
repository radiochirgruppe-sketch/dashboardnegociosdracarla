import { useState, useEffect } from 'react'

// Canal da Dra. Carla Menini — Medicina Simbólica
export const CHANNEL_ID = 'UCdIaqlE_pylO1JK4hJC9KGQ'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE    = 'https://www.googleapis.com/youtube/v3'

export function useYouTube() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!API_KEY) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        // 1. Dados do canal (inscritos, views totais, contagem de vídeos)
        const channelRes = await fetch(
          `${BASE}/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        if (!channelRes.ok) throw new Error(`YouTube API: ${channelRes.status}`)
        const channelJson = await channelRes.json()
        const stats       = channelJson.items?.[0]?.statistics ?? {}
        const snippet     = channelJson.items?.[0]?.snippet ?? {}

        // 2. Últimos 10 vídeos (para calcular views recentes)
        const searchRes = await fetch(
          `${BASE}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`
        )
        const searchJson   = await searchRes.json()
        const videoIds     = (searchJson.items ?? []).map(v => v.id.videoId).join(',')

        // 3. Estatísticas detalhadas dos vídeos recentes
        let recentVideos = []
        if (videoIds) {
          const videosRes  = await fetch(
            `${BASE}/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
          )
          const videosJson = await videosRes.json()
          recentVideos     = videosJson.items ?? []
        }

        if (!cancelled) {
          setData({
            channelTitle:   snippet.title ?? 'Medicina Simbólica',
            subscribers:    Number(stats.subscriberCount ?? 0),
            totalViews:     Number(stats.viewCount ?? 0),
            videoCount:     Number(stats.videoCount ?? 0),
            recentVideos:   recentVideos.map(v => ({
              id:          v.id,
              title:       v.snippet?.title,
              views:       Number(v.statistics?.viewCount ?? 0),
              likes:       Number(v.statistics?.likeCount ?? 0),
              comments:    Number(v.statistics?.commentCount ?? 0),
              publishedAt: v.snippet?.publishedAt?.split('T')[0],
            })),
          })
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
