import { Music2, TrendingUp, Eye, Heart } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import { tiktokStats, tiktokWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n }

const TooltipStyle = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function TikTokSection() {
  return (
    <section>
      <SectionHeading icon={Music2} title={`TikTok — ${tiktokStats.handle}`} badge="via Metricool" color="text-cyan-400" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Seguidores', value: fmt(tiktokStats.followers), sub: `+${tiktokStats.followersGrowth}% esta semana`, icon: TrendingUp, color: 'text-cyan-400' },
          { label: 'Views (30 dias)', value: fmt(tiktokStats.views30d), sub: `${fmt(tiktokStats.avgVideoViews)} por vídeo`, icon: Eye, color: 'text-blue-400' },
          { label: 'Curtidas totais', value: fmt(tiktokStats.likes), sub: `${tiktokStats.videosPosted} vídeos`, icon: Heart, color: 'text-pink-400' },
          { label: 'Engajamento', value: `${tiktokStats.engagement}%`, sub: 'média por vídeo', icon: TrendingUp, color: 'text-emerald-400' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{k.label}</span>
              <k.icon size={14} className={k.color} />
            </div>
            <p className="text-xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-sm font-medium text-gray-300 mb-4">Views + Seguidores semanais</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={tiktokWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="followGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
            <Tooltip content={<TooltipStyle />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            <Area type="monotone" dataKey="views" stroke="#06b6d4" fill="url(#viewsGrad)" strokeWidth={2} name="Views" dot={false} />
            <Area type="monotone" dataKey="followers" stroke="#ec4899" fill="url(#followGrad)" strokeWidth={2} name="Seguidores" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
