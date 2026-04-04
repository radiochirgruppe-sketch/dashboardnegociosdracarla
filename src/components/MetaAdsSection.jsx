import { Target, DollarSign, MousePointer, TrendingUp, Zap } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, Area,
} from 'recharts'
import SectionHeading from './SectionHeading'
import { metaAdsStats, metaAdsWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n }
function brl(n) { return `R$ ${n.toFixed(2).replace('.', ',')}` }

const TooltipStyle = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function MetaAdsSection() {
  const s = metaAdsStats
  const spendDelta = ((s.spendThisMonth - s.spendLastMonth) / s.spendLastMonth * 100).toFixed(1)

  return (
    <section>
      <SectionHeading icon={Target} title="Meta Ads — Tráfego Pago" badge="Assessoria MKT" color="text-blue-400" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[
          { label: 'Investimento/mês', value: brl(s.spendThisMonth), sub: `${spendDelta > 0 ? '+' : ''}${spendDelta}% vs mês ant.`, color: 'text-red-400' },
          { label: 'Alcance', value: fmt(s.reach), sub: 'pessoas únicas', color: 'text-blue-400' },
          { label: 'Impressões', value: fmt(s.impressions), sub: 'total', color: 'text-purple-400' },
          { label: 'CTR', value: `${s.ctr}%`, sub: `CPC: R$ ${s.cpc}`, color: 'text-cyan-400' },
          { label: 'Conversões', value: s.conversions, sub: `CPA: R$ ${s.cpa}`, color: 'text-emerald-400' },
          { label: 'ROAS', value: `${s.roas}x`, sub: 'retorno sobre ad spend', color: 'text-yellow-400' },
        ].map(k => (
          <div key={k.label} className="card">
            <span className="stat-label block mb-2">{k.label}</span>
            <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Investimento vs Conversões (semanal)</p>
          <ResponsiveContainer width="100%" height={190}>
            <ComposedChart data={metaAdsWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipStyle />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Area type="monotone" dataKey="spend" fill="url(#spendGrad)" stroke="#3b82f6" strokeWidth={2} name="Invest. (R$)" dot={false} />
              <Bar dataKey="conversions" fill="#22c55e" radius={[3, 3, 0, 0]} name="Conversões" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Alcance semanal</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={metaAdsWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<TooltipStyle />} />
              <Bar dataKey="reach" fill="#a855f7" radius={[3, 3, 0, 0]} name="Alcance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
