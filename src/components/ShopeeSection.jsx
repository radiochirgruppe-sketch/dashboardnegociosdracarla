import { ShoppingBag, Users, MousePointer, DollarSign, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import { shopeeStats, shopeeWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n }
function brl(n) { return `R$ ${n.toFixed(2).replace('.', ',')}` }

const TooltipStyle = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.dataKey === 'commission' ? `R$ ${p.value}` : p.value}
        </p>
      ))}
    </div>
  )
}

export default function ShopeeSection() {
  return (
    <section>
      <SectionHeading icon={ShoppingBag} title="Shopee Afiliados" badge="Telegram + Instagram" color="text-orange-400" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Membros Telegram', value: shopeeStats.telegramMembers, sub: `+${shopeeStats.telegramMembersGrowth}% esta semana`, icon: Users, color: 'text-blue-400' },
          { label: 'Cliques no mês', value: shopeeStats.clicksThisMonth.toLocaleString('pt-BR'), sub: `${shopeeStats.topProductClicks} no top produto`, icon: MousePointer, color: 'text-orange-400' },
          { label: 'Conversões', value: shopeeStats.conversions, sub: `${shopeeStats.conversionRate}% de conversão`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Comissão total', value: brl(shopeeStats.commissionTotal), sub: `${brl(shopeeStats.commissionThisMonth)} este mês`, icon: DollarSign, color: 'text-yellow-400' },
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

      {/* Top product callout */}
      <div className="card mb-4 flex items-center gap-4 bg-orange-950/20 border-orange-900/30">
        <div className="w-10 h-10 rounded-xl bg-orange-900/40 flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={18} className="text-orange-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Produto mais clicado</p>
          <p className="text-sm font-semibold text-white">{shopeeStats.topProductName}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xl font-bold text-orange-400">{shopeeStats.topProductClicks}</p>
          <p className="text-xs text-gray-500">cliques</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Cliques vs Conversões (semanal)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={shopeeWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipStyle />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Bar dataKey="clicks" fill="#f97316" radius={[3, 3, 0, 0]} name="Cliques" />
              <Bar dataKey="conversions" fill="#22c55e" radius={[3, 3, 0, 0]} name="Conversões" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-gray-300 mb-4">Comissão semanal (R$)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={shopeeWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipStyle />} />
              <Line type="monotone" dataKey="commission" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 3 }} name="Comissão" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
