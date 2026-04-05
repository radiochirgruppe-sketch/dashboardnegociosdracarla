// ── Shopee Afiliados Brasil — Open API (GraphQL) ──────────────────
// Docs: https://www.affiliateshopee.com.br/documentacao
// Base URL: https://open-api.affiliate.shopee.com.br/graphql
// Auth: cada request precisa de assinatura SHA-256
// Requer aprovação como parceiro afiliado Shopee.

// ATENÇÃO: a assinatura usa a Secret Key no servidor.
// Em produção, crie um backend/proxy (ex: Cloudflare Worker, Vercel
// Function) para nunca expor VITE_SHOPEE_SECRET_KEY no frontend.

const BASE = 'https://open-api.affiliate.shopee.com.br/graphql'

async function sign(payload) {
  const appId    = import.meta.env.VITE_SHOPEE_APP_ID
  const secret   = import.meta.env.VITE_SHOPEE_SECRET_KEY
  const ts       = Math.floor(Date.now() / 1000).toString()
  const message  = appId + ts + payload + secret

  // SubtleCrypto (disponível no browser moderno)
  const enc  = new TextEncoder()
  const key  = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig  = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const hex  = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')

  return { appId, ts, sig: hex }
}

async function query(gql) {
  const payload     = JSON.stringify({ query: gql })
  const { appId, ts, sig } = await sign(payload)

  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `SHA256 appid=${appId},nonce=${ts},signature=${sig}`,
    },
    body: payload,
  })
  if (!res.ok) throw new Error(`Shopee API: ${res.status}`)
  return res.json()
}

// Retorna relatório de performance do afiliado no período
// dateFrom / dateTo: 'YYYY-MM-DD'
export async function getPerformanceReport(dateFrom, dateTo) {
  return query(`
    query {
      affiliateReport(startDate: "${dateFrom}", endDate: "${dateTo}") {
        clicks
        orders
        revenue
        commissionEarned
      }
    }
  `)
}

// Retorna top produtos clicados
export async function getTopProducts(dateFrom, dateTo, limit = 10) {
  return query(`
    query {
      topProducts(startDate: "${dateFrom}", endDate: "${dateTo}", limit: ${limit}) {
        productId
        productName
        clicks
        orders
        commission
      }
    }
  `)
}
