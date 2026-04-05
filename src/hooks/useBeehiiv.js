import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY
const BASE    = 'https://api.beehiiv.com/v2'

function headers() {
  return { Authorization: `Bearer ${API_KEY}` }
}

async function fetchPublication(id) {
  const [pub, subs] = await Promise.all([
    fetch(`${BASE}/publications/${id}`, { headers: headers() }).then(r => r.json()),
    fetch(`${BASE}/publications/${id}/subscriptions?limit=1`, { headers: headers() }).then(r => r.json()),
  ])
  return { pub: pub.data, totalSubs: subs.total_results ?? 0 }
}

async function fetchRecentPosts(id) {
  const r = await fetch(
    `${BASE}/publications/${id}/posts?limit=5&expand[]=stats`,
    { headers: headers() }
  )
  const json = await r.json()
  return json.data ?? []
}

export function useBeehiiv(pubIds) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!API_KEY || !pubIds?.length) return

    let cancelled = false

    async function load() {
      try {
        const results = await Promise.all(
          pubIds.map(async ({ id, name }) => {
            const { pub, totalSubs } = await fetchPublication(id)
            const posts              = await fetchRecentPosts(id)

            // média de open rate e click rate das últimas 5 edições
            const statsArr   = posts.map(p => p.stats).filter(Boolean)
            const avgOpen    = statsArr.length
              ? (statsArr.reduce((a, s) => a + (s.email_open_rate ?? 0), 0) / statsArr.length * 100).toFixed(1)
              : null
            const avgClick   = statsArr.length
              ? (statsArr.reduce((a, s) => a + (s.email_click_rate ?? 0), 0) / statsArr.length * 100).toFixed(1)
              : null

            return {
              id,
              name,
              subscribers:    totalSubs,
              openRate:       avgOpen   ? Number(avgOpen)  : null,
              clickRate:      avgClick  ? Number(avgClick) : null,
              lastIssueDate:  posts[0]?.publish_date?.split('T')[0] ?? '—',
              frequency:      'Semanal',
              adsenseEligible: totalSubs >= 1000,
            }
          })
        )
        if (!cancelled) {
          setData(results)
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
