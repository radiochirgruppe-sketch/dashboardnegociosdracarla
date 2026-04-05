// ── Meta Marketing API v22.0 ──────────────────────────────────────
// Docs: https://developers.facebook.com/docs/marketing-api
// Auth: System User Access Token (não expira) — recomendado.
// Como gerar: Business Manager → Configurações → Usuários do sistema
//             → Criar usuário do sistema → Gerar token → selecionar
//             permissões: ads_read, ads_management, business_management

const BASE = 'https://graph.facebook.com/v22.0'
const TOKEN = import.meta.env.VITE_META_ACCESS_TOKEN
const AD_ACCOUNT = import.meta.env.VITE_META_AD_ACCOUNT_ID // ex: act_000000000

function gfetch(path, params = {}) {
  const p = new URLSearchParams({ access_token: TOKEN, ...params })
  return fetch(`${BASE}/${path}?${p}`).then(r => {
    if (!r.ok) throw new Error(`Meta API ${path}: ${r.status}`)
    return r.json()
  })
}

// Retorna insights da conta de anúncios num período
// level: 'account' | 'campaign' | 'adset' | 'ad'
// datePreset: 'this_month' | 'last_month' | 'last_7d' | 'last_30d'
export async function getAccountInsights(datePreset = 'this_month') {
  return gfetch(`${AD_ACCOUNT}/insights`, {
    level: 'account',
    date_preset: datePreset,
    fields: [
      'spend',
      'reach',
      'impressions',
      'clicks',
      'ctr',
      'cpc',
      'actions',       // inclui conversões
      'cost_per_action_type',
      'purchase_roas',
    ].join(','),
  })
}

// Retorna campanhas ativas
export async function getCampaigns() {
  return gfetch(`${AD_ACCOUNT}/campaigns`, {
    effective_status: '["ACTIVE"]',
    fields: 'id,name,status,daily_budget,lifetime_budget',
  })
}

// Retorna insights semana a semana para gráfico de tendência
// Últimas 8 semanas: usa time_range + time_increment=7
export async function getWeeklyInsights() {
  const today = new Date()
  const since = new Date(today)
  since.setDate(today.getDate() - 56) // 8 semanas atrás

  return gfetch(`${AD_ACCOUNT}/insights`, {
    level: 'account',
    time_range: JSON.stringify({
      since: since.toISOString().split('T')[0],
      until: today.toISOString().split('T')[0],
    }),
    time_increment: 7,
    fields: 'date_start,spend,reach,impressions,clicks,actions',
  })
}
