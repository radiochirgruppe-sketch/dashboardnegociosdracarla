// ── Google Analytics 4 — Data API v1beta ─────────────────────────
// Docs: https://developers.google.com/analytics/devguides/reporting/data/v1
// Auth: Service Account (recomendado para uso automático sem login)
//
// SETUP:
//  1. console.cloud.google.com → criar projeto → ativar "Google Analytics Data API"
//  2. IAM → Contas de serviço → Criar → baixar JSON
//  3. No GA4: Admin → Gerenciamento de acesso à propriedade →
//     adicionar e-mail da conta de serviço como "Visualizador"
//
// ATENÇÃO: o JSON da conta de serviço contém chave privada.
//  Em produção, use um backend (Vercel Function, Cloud Run) para
//  fazer o token exchange e nunca exponha a chave no frontend.
//  Aqui, usamos a biblioteca google-auth-library no lado do cliente
//  apenas para desenvolvimento local.

const PROPERTY_ID = import.meta.env.VITE_GA4_PROPERTY_ID // ex: properties/123456789
const BASE = `https://analyticsdata.googleapis.com/v1beta/${PROPERTY_ID}`

// Gera access token usando a Service Account (OAuth2 JWT flow)
// Em produção substitua por chamada ao seu backend.
async function getAccessToken() {
  const sa = JSON.parse(import.meta.env.VITE_GA4_SERVICE_ACCOUNT_JSON)

  const now  = Math.floor(Date.now() / 1000)
  const exp  = now + 3600

  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp,
  }))

  // Assinar com a chave privada RSA da service account
  const pemKey = sa.private_key
  const keyData = pemKey.replace(/-----.*-----/g, '').replace(/\n/g, '')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const sigBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
  const jwt = `${header}.${payload}.${sig}`

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  })
  const { access_token } = await resp.json()
  return access_token
}

async function runReport(body) {
  const token = await getAccessToken()
  const res = await fetch(`${BASE}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GA4 runReport: ${res.status}`)
  return res.json()
}

// Métricas dos últimos 30 dias: sessões, usuários, visualizações de página
export async function getOverview() {
  return runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
    returnPropertyQuota: true,
  })
}

// Tendência semanal dos últimos 56 dias (8 semanas)
export async function getWeeklyTrend() {
  return runReport({
    dateRanges: [{ startDate: '56daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'week' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
    ],
    orderBys: [{ dimension: { dimensionName: 'week' } }],
    returnPropertyQuota: true,
  })
}

// Top páginas por visualizações
export async function getTopPages(limit = 10) {
  return runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    limit,
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  })
}

// Canal de aquisição (organic, social, direct, paid...)
export async function getChannelBreakdown() {
  return runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'conversions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })
}
