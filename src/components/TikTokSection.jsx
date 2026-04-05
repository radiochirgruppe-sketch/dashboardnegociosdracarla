import { Music2, TrendingUp, Eye, Heart } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import EditableField from './EditableField'
import { useData } from '../context/DataContext'
import { tiktokWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }

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
  const { data, editMode, update } = useData()
  const tt = data.tiktok

  return (
    <section>
      <SectionHeading icon={Music2} title={`TikTok — @saudeinfo`} badge="via Metricool" color="text-cyan-400" />

      {editMode && (
        <p className="text-xs text-brand-400 bg-brand-900/20 border border-brand-800/30 rounded-lg px-3 py-2 mb-4">
          Clique em qualquer número para editar. Fonte: Metricool → TikTok → Resumo.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: 'Seguidores',
            field: 'followers',
            value: tt.followers,
            format: fmt,
            sub: null,
            subField: 'followersGrowth',
            subFormat: v => `${v > 0 ? '+' : ''}${v}% esta semana`,
            subStep: 0.1,
            icon: TrendingUp,
            color: 'text-cyan-400',
          },
          {
            label: 'Views (30 dias)',
            field: 'views30d',
            value: tt.views30d,
            format: fmt,
            sub: null,
            subField: 'avgVideoViews',
            subFormat: v => `${fmt(v)} por vídeo`,
            icon: Eye,
            color: 'text-blue-400',
          },
          {
            label: 'Curtidas totais',
            field: 'likes',
            value: tt.likes,
            format: fmt,
            sub: null,
            subField: 'videosPosted',
            subFormat: v => `${v} vídeos`,
            icon: Heart,
            color: 'text-pink-400',
          },
          {
            label: 'Engajamento',
            field: 'engagement',
            value: tt.engagement,
            format: v => `${v}%`,
            step: 0.1,
            sub: 'média por vídeo',
            subField: null,
            icon: TrendingUp,
            color: 'text-emerald-400',
          },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{k.label}</span>
              <k.icon size={14} className={k.color} />
            </div>
            <EditableField
              value={k.value}
              onChange={v => update('tiktok', k.field, v)}
              format={k.format}
              step={k.step ?? 1}
              label={k.label}
              className="text-xl font-bold text-white"
            />
            {k.subField ? (
              <EditableField
                value={tt[k.subField]}
                onChange={v => update('tiktok', k.subField, v)}
                format={k.subFormat}
                step={k.subStep ?? 1}
                label={k.subField}
                className="text-xs text-gray-500 mt-0.5"
              />
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
            )}
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
