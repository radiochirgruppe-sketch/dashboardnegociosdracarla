import { Youtube, Clock, Users, Play } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import ProgressBar from './ProgressBar'
import { youtubeStats, youtubeWeekly, youtubePlaylists } from '../data/mockData'

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

export default function YouTubeSection() {
  const { subscribers, subscribersGoal, watchHours, watchHoursGoal } = youtubeStats
  const yppPct = Math.round(((subscribers / subscribersGoal) + (watchHours / watchHoursGoal)) / 2 * 100)

  return (
    <section>
      <SectionHeading icon={Youtube} title="YouTube — Medicina Simbólica" badge="YPP em andamento" color="text-red-400" />

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Inscritos', value: youtubeStats.subscribers.toLocaleString('pt-BR'), icon: Users, color: 'text-red-400' },
          { label: 'Horas assistidas (12m)', value: youtubeStats.watchHours.toLocaleString('pt-BR'), icon: Clock, color: 'text-orange-400' },
          { label: 'Visualizações totais', value: fmt(youtubeStats.totalViews), icon: Play, color: 'text-yellow-400' },
          { label: 'Duração média', value: youtubeStats.avgViewDuration, icon: Clock, color: 'text-green-400' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{k.label}</span>
              <k.icon size={14} className={k.color} />
            </div>
            <p className="text-xl font-bold text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* YPP Progress */}
      <div className="card mb-5">
        <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-yellow-400">★</span> Progresso para Monetização (YPP)
          <span className="ml-auto text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/50 px-2 py-0.5 rounded-full">
            {yppPct}% concluído
          </span>
        </p>
        <div className="space-y-4">
          <ProgressBar
            value={subscribers}
            max={subscribersGoal}
            label="1.000 Inscritos"
            color="bg-red-500"
          />
          <ProgressBar
            value={watchHours}
            max={watchHoursGoal}
            label="4.000 Horas Assistidas"
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Inscritos + Horas (semanal)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={youtubeWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<TooltipStyle />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Area type="monotone" dataKey="subscribers" stroke="#ef4444" fill="url(#subGrad)" strokeWidth={2} name="Inscritos" dot={false} />
              <Area type="monotone" dataKey="watchHours" stroke="#f97316" fill="url(#hoursGrad)" strokeWidth={2} name="Horas" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Visualizações semanais</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={youtubeWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<TooltipStyle />} />
              <Bar dataKey="views" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Playlists */}
      <div className="card">
        <p className="text-sm font-medium text-gray-300 mb-3">Playlists temáticas</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {youtubePlaylists.map(pl => (
            <div key={pl.name} className="bg-gray-800/60 rounded-xl p-3 text-xs">
              <p className="text-gray-400 mb-1 truncate">{pl.name}</p>
              <p className="text-lg font-bold text-white">{pl.videos}</p>
              <p className="text-gray-500">vídeos · {fmt(pl.views)} views</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
