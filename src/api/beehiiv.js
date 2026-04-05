// ── Beehiiv API v2 ────────────────────────────────────────────────
// Docs: https://developers.beehiiv.com
// Disponível em todos os planos (inclusive gratuito). Chaves em .env.

const BASE = 'https://api.beehiiv.com/v2'

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_BEEHIIV_API_KEY}`,
  'Content-Type': 'application/json',
}

// Retorna dados de uma publicação (newsletter) pelo ID
export async function getPublication(publicationId) {
  const res = await fetch(`${BASE}/publications/${publicationId}`, { headers })
  if (!res.ok) throw new Error(`Beehiiv getPublication: ${res.status}`)
  return res.json()
}

// Retorna lista de inscritos de uma newsletter
// params: { limit, page, status: 'active'|'inactive' }
export async function getSubscribers(publicationId, queryParams = {}) {
  const p = new URLSearchParams({ limit: 100, ...queryParams })
  const res = await fetch(`${BASE}/publications/${publicationId}/subscriptions?${p}`, { headers })
  if (!res.ok) throw new Error(`Beehiiv getSubscribers: ${res.status}`)
  return res.json()
}

// Retorna lista de edições (posts) publicadas
export async function getPosts(publicationId) {
  const res = await fetch(`${BASE}/publications/${publicationId}/posts?limit=10`, { headers })
  if (!res.ok) throw new Error(`Beehiiv getPosts: ${res.status}`)
  return res.json()
}

// Retorna métricas de uma edição específica
export async function getPostStats(publicationId, postId) {
  const res = await fetch(`${BASE}/publications/${publicationId}/posts/${postId}?expand[]=stats`, { headers })
  if (!res.ok) throw new Error(`Beehiiv getPostStats: ${res.status}`)
  return res.json()
}

// Busca as duas newsletters configuradas no .env
export async function getAllNewslettersData() {
  const [medicina, desafios] = await Promise.all([
    getPublication(import.meta.env.VITE_BEEHIIV_PUBLICATION_MEDICINA),
    getPublication(import.meta.env.VITE_BEEHIIV_PUBLICATION_DESAFIOS),
  ])
  return { medicina: medicina.data, desafios: desafios.data }
}
