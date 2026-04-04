import { Users, Eye, DollarSign, TrendingUp } from 'lucide-react'
import { instagramProfiles, youtubeStats, tiktokStats, newsletters, shopeeStats, metaAdsStats } from '../data/mockData'

function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n
}

export default function OverviewKPIs() {
  const totalFollowers =
    instagramProfiles.reduce((a, p) => a + p.followers, 0) +
    youtubeStats.subscribers +
    tiktokStats.followers

  const totalReach =
    instagramProfiles.reduce((a, p) => a + p.reach, 0) +
    tiktokStats.views30d +
    youtubeStats.totalViews

  const totalNewsletterSubs = newsletters.reduce((a, n) => a + n.subscribers, 0)

  const totalRevenue = shopeeStats.commissionThisMonth

  const kpis = [
    {
      label: 'Audiência total',
      value: fmt(totalFollowers),
      sub: 'Instagram + YouTube + TikTok',
      icon: Users,
      gradient: 'from-brand-900/60 to-brand-800/20 border-brand-700/30',
      iconColor: 'text-brand-400',
    },
    {
      label: 'Alcance estimado / 30 dias',
      value: fmt(totalReach),
      sub: 'Todos os canais orgânicos',
      icon: Eye,
      gradient: 'from-blue-900/60 to-blue-800/20 border-blue-700/30',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Inscritos newsletters',
      value: fmt(totalNewsletterSubs),
      sub: 'Medicina Simbólica + Desafios',
      icon: TrendingUp,
      gradient: 'from-yellow-900/60 to-yellow-800/20 border-yellow-700/30',
      iconColor: 'text-yellow-400',
    },
    {
      label: 'Receita afiliados (mês)',
      value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
      sub: 'Shopee — em crescimento',
      icon: DollarSign,
      gradient: 'from-emerald-900/60 to-emerald-800/20 border-emerald-700/30',
      iconColor: 'text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {kpis.map(k => (
        <div
          key={k.label}
          className={`rounded-2xl border bg-gradient-to-br p-5 ${k.gradient}`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="stat-label">{k.label}</span>
            <k.icon size={16} className={k.iconColor} />
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">{k.value}</p>
          <p className="text-xs text-gray-500 mt-1">{k.sub}</p>
        </div>
      ))}
    </div>
  )
}
