// ──────────────────────────────────────────────────────────────────────────────
// Mock data — substituir pelos valores reais das APIs (Metricool, Google
// Analytics, Beehiiv, Shopee, Meta Ads) quando as integrações estiverem prontas.
// ──────────────────────────────────────────────────────────────────────────────

// Últimas 8 semanas (eixo X para todos os gráficos de tendência)
export const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']

// ─── Instagram ────────────────────────────────────────────────────────────────
export const instagramProfiles = [
  {
    handle: '@radiochir',
    niche: 'Medicina Simbólica / Saúde',
    followers: 8_420,
    followersGrowth: +3.2,
    reach: 24_800,
    impressions: 51_300,
    engagement: 4.7,
    postsThisMonth: 28,
    color: '#a855f7',
    trend: [5200, 5900, 6400, 6800, 7100, 7600, 8000, 8420],
  },
  {
    handle: '@medicinasimbolica',
    niche: 'Marca principal Dra. Carla',
    followers: 12_750,
    followersGrowth: +2.1,
    reach: 38_500,
    impressions: 79_200,
    engagement: 3.9,
    postsThisMonth: 30,
    color: '#ec4899',
    trend: [10200, 10800, 11100, 11500, 11900, 12200, 12500, 12750],
  },
  {
    handle: '@financasig',
    niche: 'Finanças',
    followers: 3_180,
    followersGrowth: +5.4,
    reach: 9_600,
    impressions: 20_100,
    engagement: 5.2,
    postsThisMonth: 24,
    color: '#22c55e',
    trend: [2100, 2300, 2500, 2700, 2900, 3000, 3100, 3180],
  },
  {
    handle: '@mandaladark',
    niche: 'Mandala / Espiritualidade',
    followers: 5_640,
    followersGrowth: +1.8,
    reach: 16_200,
    impressions: 33_400,
    engagement: 4.1,
    postsThisMonth: 26,
    color: '#f97316',
    trend: [4800, 4950, 5100, 5200, 5350, 5450, 5550, 5640],
  },
]

export const instagramWeeklyReach = weeks.map((w, i) => ({
  week: w,
  radiochir:        [18000, 19400, 20100, 21300, 22000, 23100, 24000, 24800][i],
  medicinasimbolica:[28000, 30000, 31500, 33000, 34800, 36000, 37500, 38500][i],
  financasig:       [6200,  6800,  7200,  7900,  8300,  8800,  9200,  9600][i],
  mandaladark:      [11000, 12000, 12900, 13500, 14200, 15000, 15700, 16200][i],
}))

// ─── YouTube ──────────────────────────────────────────────────────────────────
export const youtubeStats = {
  subscribers: 743,
  subscribersGoal: 1000,
  watchHours: 2_840,
  watchHoursGoal: 4000,
  totalViews: 48_600,
  avgViewDuration: '4:12',
  videosPublished: 62,
  shortsPublished: 38,
  topVideoViews: 8_200,
  monthlySubscriberGrowth: +18,
}

export const youtubeWeekly = weeks.map((w, i) => ({
  week: w,
  subscribers: [620, 643, 661, 678, 700, 718, 730, 743][i],
  watchHours:  [2200, 2340, 2450, 2550, 2650, 2730, 2790, 2840][i],
  views:       [4200, 4800, 5100, 5500, 5900, 6200, 6600, 7100][i],
}))

export const youtubePlaylists = [
  { name: 'Medicina Simbólica',  videos: 24, views: 21300 },
  { name: 'Saúde Funcional',     videos: 16, views: 14800 },
  { name: 'Desafios Online',     videos: 12, views: 8200  },
  { name: 'Shorts',              videos: 10, views: 4300  },
]

// ─── TikTok ───────────────────────────────────────────────────────────────────
export const tiktokStats = {
  handle: '@saudeinfo',
  followers: 4_120,
  followersGrowth: +7.3,
  likes: 28_400,
  views30d: 94_500,
  avgVideoViews: 2_480,
  videosPosted: 34,
  engagement: 6.1,
  trend: [2100, 2400, 2700, 3000, 3300, 3600, 3900, 4120],
}

export const tiktokWeekly = weeks.map((w, i) => ({
  week: w,
  views:     [9800, 10500, 11200, 11800, 12300, 12900, 13400, 14200][i],
  followers: [2100, 2400, 2700, 3000, 3300, 3600, 3900, 4120][i],
}))

// ─── Beehiiv (Newsletters) ────────────────────────────────────────────────────
export const newsletters = [
  {
    name: 'Medicina Simbólica',
    subscribers: 100,
    subscribersGoal: 500,
    openRate: 42.5,
    clickRate: 8.3,
    lastIssueDate: '2026-04-02',
    frequency: 'Semanal',
    adsenseEligible: false,
    color: '#a855f7',
    trend: [68, 72, 78, 82, 87, 92, 96, 100],
  },
  {
    name: 'Desafios Online',
    subscribers: 1_082,
    subscribersGoal: 2500,
    openRate: 38.2,
    clickRate: 6.9,
    lastIssueDate: '2026-04-03',
    frequency: 'Semanal',
    adsenseEligible: true,
    color: '#22c55e',
    trend: [780, 820, 870, 920, 960, 1000, 1040, 1082],
  },
]

export const newsletterWeekly = weeks.map((w, i) => ({
  week: w,
  medicinasimbolica: [68, 72, 78, 82, 87, 92, 96, 100][i],
  desafiosonline:    [780, 820, 870, 920, 960, 1000, 1040, 1082][i],
}))

// ─── Shopee Afiliados ─────────────────────────────────────────────────────────
export const shopeeStats = {
  telegramMembers: 312,
  telegramMembersGrowth: +14.2,
  clicksThisMonth: 1_840,
  conversions: 94,
  conversionRate: 5.1,
  commissionTotal: 487.30,
  commissionThisMonth: 87.60,
  topProductClicks: 280,
  topProductName: 'Kit Suplementos Imunidade',
  trend: [42, 55, 61, 68, 74, 79, 85, 94],
}

export const shopeeWeekly = weeks.map((w, i) => ({
  week: w,
  clicks:      [180, 200, 220, 235, 245, 250, 260, 250][i],
  conversions: [8,   10,  12,  11,  13,  13,  14,  13][i],
  commission:  [38,  45,  52,  49,  58,  57,  63,  56][i],
}))

// ─── Meta Ads ─────────────────────────────────────────────────────────────────
export const metaAdsStats = {
  spendThisMonth: 1_240.00,
  spendLastMonth: 980.00,
  reach: 68_400,
  impressions: 142_000,
  clicks: 3_820,
  ctr: 2.69,
  cpc: 0.32,
  conversions: 186,
  cpa: 6.67,
  roas: 3.4,
}

export const metaAdsWeekly = weeks.map((w, i) => ({
  week: w,
  spend:       [220, 260, 285, 295, 295, 310, 320, 310][i],
  reach:       [7200, 8100, 8800, 9000, 9100, 9500, 9800, 9400][i],
  conversions: [18,  21,  24,  25,  24,  26,  27,  25][i],
}))

// ─── Status consolidado ───────────────────────────────────────────────────────
export const automationStatus = [
  { name: 'Lâminas estáticas diárias', channel: 'Instagram (4 perfis)', tool: 'Manus',           status: 'Rodando' },
  { name: 'Shorts automáticos',        channel: 'YouTube MS + TikTok',  tool: 'Metricool',        status: 'Rodando' },
  { name: 'Newsletter',                channel: 'Beehiiv (2 NLs)',      tool: 'Beehiiv',          status: 'Rodando' },
  { name: 'Otimização YouTube',        channel: 'Canal MS',             tool: 'Manual',           status: 'Concluído' },
  { name: 'Afiliação Shopee',          channel: 'Telegram + IG',        tool: 'Shopee Afiliados', status: 'Rodando' },
  { name: 'Curadoria ofertas',         channel: 'Notion',               tool: 'Manual',           status: 'Rodando' },
  { name: 'Tráfego pago low ticket',   channel: 'Meta Ads',             tool: 'Assessoria MKT',   status: 'Ativo' },
  { name: 'Mentoria TikTok/Shopee',    channel: 'Multi-canal',          tool: 'Mentoria Yasmim',  status: 'Em curso' },
]

// ─── Próximos passos ──────────────────────────────────────────────────────────
export const nextSteps = [
  { id: 1, done: false, text: 'Solicitar Adsense/Boost Beehiiv para newsletter Radiochir' },
  { id: 2, done: false, text: 'Verificar elegibilidade dos Desafios Online (1.000+ inscritos) para monetização' },
  { id: 3, done: false, text: 'Atingir metas YPP no YouTube MS — acompanhar mensalmente' },
  { id: 4, done: false, text: 'Expandir grupo Telegram Shopee para WhatsApp' },
  { id: 5, done: false, text: 'Criar SOP documentado para o fluxo Manus → Instagram' },
  { id: 6, done: true,  text: 'Integrar métricas de todos os canais em dashboard único' },
  { id: 7, done: false, text: 'Avaliar replicar modelo de afiliação para Amazon ou outros programas' },
]
