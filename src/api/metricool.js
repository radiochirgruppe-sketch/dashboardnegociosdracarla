// ── Metricool API ─────────────────────────────────────────────────
// Docs: https://app.metricool.com/resources/apidocs/index.html
// Requer plano Advanced. Chaves em .env (VITE_METRICOOL_*)

const BASE = 'https://app.metricool.com/api'

const headers = {
  'X-Mc-Auth': import.meta.env.VITE_METRICOOL_USER_TOKEN,
}

function params(extra = {}) {
  return new URLSearchParams({
    userId: import.meta.env.VITE_METRICOOL_USER_ID,
    blogId: import.meta.env.VITE_METRICOOL_BLOG_ID,
    ...extra,
  })
}

// Retorna métricas gerais dos perfis conectados
export async function getProfiles() {
  const res = await fetch(`${BASE}/admin/simpleProfiles?${params()}`, { headers })
  if (!res.ok) throw new Error(`Metricool getProfiles: ${res.status}`)
  return res.json()
}

// Retorna estatísticas de um perfil específico num intervalo de datas
// network: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE'
// initDate / endDate: 'YYYY-MM-DD'
export async function getNetworkStats(network, initDate, endDate) {
  const p = params({ network, initDate, endDate })
  const res = await fetch(`${BASE}/v2/analytics/overview?${p}`, { headers })
  if (!res.ok) throw new Error(`Metricool getNetworkStats: ${res.status}`)
  return res.json()
}

// Retorna posts agendados / publicados
export async function getPosts(network, initDate, endDate) {
  const p = params({ network, initDate, endDate })
  const res = await fetch(`${BASE}/v2/posts?${p}`, { headers })
  if (!res.ok) throw new Error(`Metricool getPosts: ${res.status}`)
  return res.json()
}
