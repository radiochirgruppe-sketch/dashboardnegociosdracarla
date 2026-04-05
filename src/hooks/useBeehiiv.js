import { useCallback } from 'react'
import { useAutoFetch } from './useAutoFetch'

const API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY
const BASE    = 'https://api.beehiiv.com/v2'

export const PUB_IDS = [
  { id: 'pub_217528d9-9240-4480-867b-cc148538f37a', name: 'Medicina Simbólica' },
  { id: 'pub_212ca56c-5e06-4112-8201-41a53b81b5bb', name: 'Desafios Online' },
]

const hdrs = { Authorization: `Bearer ${API_KEY}` }

async function fetchOne({ id, name }) {
  const [pubRes, subRes, postsRes] = await Promise.all([
    fetch(`${BASE}/publications/${id}`,                            { headers: hdrs }),
    fetch(`${BASE}/publications/${id}/subscriptions?limit=1`,      { headers: hdrs }),
    fetch(`${BASE}/publications/${id}/posts?limit=5&expand[]=stats`, { headers: hdrs }),
  ])

  if (!pubRes.ok)   throw new Error(`Beehiiv pub ${id}: ${pubRes.status}`)
  if (!subRes.ok)   throw new Error(`Beehiiv subs ${id}: ${subRes.status}`)
  if (!postsRes.ok) throw new Error(`Beehiiv posts ${id}: ${postsRes.status}`)

  const [pub, subs, posts] = await Promise.all([pubRes.json(), subRes.json(), postsRes.json()])

  const statsArr  = (posts.data ?? []).map(p => p.stats).filter(Boolean)
  const avgOpen   = statsArr.length
    ? +(statsArr.reduce((a, s) => a + (s.email_open_rate ?? 0), 0) / statsArr.length * 100).toFixed(1)
    : null
  const avgClick  = statsArr.length
    ? +(statsArr.reduce((a, s) => a + (s.email_click_rate ?? 0), 0) / statsArr.length * 100).toFixed(1)
    : null

  return {
    id,
    name,
    subscribers:     subs.total_results ?? 0,
    openRate:        avgOpen,
    clickRate:       avgClick,
    lastIssueDate:   posts.data?.[0]?.publish_date?.split('T')[0] ?? '—',
    frequency:       'Semanal',
    adsenseEligible: (subs.total_results ?? 0) >= 1000,
  }
}

async function fetchAll() {
  return Promise.all(PUB_IDS.map(fetchOne))
}

export function useBeehiiv() {
  const fetcher = useCallback(fetchAll, [])

  return useAutoFetch('beehiiv', fetcher, {
    ttl:       30 * 60_000,   // cache de 30 min
    refreshMs: 30 * 60_000,   // auto-refresh a cada 30 min
    enabled:   !!API_KEY,
  })
}
