import { Instagram, Users, TrendingUp, Eye } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import SectionHeading from './SectionHeading'
import { instagramProfiles, instagramWeeklyReach } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n }

const CustomTooltip = ({ active, payload, label }) => {
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

export default function InstagramSection() {
  return (
    <section>
      <SectionHeading icon={Instagram} title="Instagram — 4 Perfis" badge="via Metricool" color="text-pink-400" />

      {/* Profile cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {instagramProfiles.map(p => (
          <div key={p.handle} className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">{p.handle}</span>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            </div>
            <p className="text-lg font-bold text-white">{fmt(p.followers)}</p>
            <p className="text-xs text-gray-500 -mt-2">seguidores</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Alcance</span>
              <span className="text-gray-300">{fmt(p.reach)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Engaj.</span>
              <span className="text-gray-300">{p.engagement}%</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <TrendingUp size={11} />
              +{p.followersGrowth}% esta semana
            </div>
          </div>
        ))}
      </div>

      {/* Combined reach chart */}
      <div className="card">
        <p className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
          <Eye size={14} className="text-gray-500" /> Alcance semanal por perfil
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={instagramWeeklyReach} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            {instagramProfiles.map(p => (
              <Line
                key={p.handle}
                type="monotone"
                dataKey={p.handle.replace('@', '')}
                stroke={p.color}
                strokeWidth={2}
                dot={false}
                name={p.handle}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-profile engagement summary */}
      <div className="mt-3 card">
        <p className="text-sm font-medium text-gray-300 mb-3">Resumo de engajamento</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 uppercase tracking-wider">
                <th className="text-left pb-2">Perfil</th>
                <th className="text-left pb-2">Nicho</th>
                <th className="text-right pb-2">Seguidores</th>
                <th className="text-right pb-2">Alcance</th>
                <th className="text-right pb-2">Impressões</th>
                <th className="text-right pb-2">Engaj.</th>
                <th className="text-right pb-2">Posts/mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {instagramProfiles.map(p => (
                <tr key={p.handle} className="text-gray-300">
                  <td className="py-2">
                    <span className="font-mono" style={{ color: p.color }}>{p.handle}</span>
                  </td>
                  <td className="py-2 text-gray-500">{p.niche}</td>
                  <td className="py-2 text-right">{p.followers.toLocaleString('pt-BR')}</td>
                  <td className="py-2 text-right">{p.reach.toLocaleString('pt-BR')}</td>
                  <td className="py-2 text-right">{p.impressions.toLocaleString('pt-BR')}</td>
                  <td className="py-2 text-right">{p.engagement}%</td>
                  <td className="py-2 text-right">{p.postsThisMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
