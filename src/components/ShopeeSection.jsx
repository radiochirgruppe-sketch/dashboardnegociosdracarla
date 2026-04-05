import { ShoppingBag, Users, MousePointer, DollarSign, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import EditableField from './EditableField'
import { useData } from '../context/DataContext'
import { shopeeWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }
function brl(n) { return `R$ ${Number(n).toFixed(2).replace('.', ',')}` }

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
  const { data, editMode, update } = useData()
  const s = data.shopee

  return (
    <section>
      <SectionHeading icon={ShoppingBag} title="Shopee Afiliados" badge="Telegram + Instagram" color="text-orange-400" />

      {editMode && (
        <p className="text-xs text-brand-400 bg-brand-900/20 border border-brand-800/30 rounded-lg px-3 py-2 mb-4">
          Clique em qualquer número para editar. Fonte: painel Shopee Afiliados + contagem manual do Telegram.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: 'Membros Telegram',
            field: 'telegramMembers',
            value: s.telegramMembers,
            format: v => String(v),
            subField: 'telegramMembersGrowth',
            subFormat: v => `+${v}% esta semana`,
            subStep: 0.1,
            icon: Users,
            color: 'text-blue-400',
          },
          {
            label: 'Cliques no mês',
            field: 'clicksThisMonth',
            value: s.clicksThisMonth,
            format: v => v.toLocaleString('pt-BR'),
            subField: 'topProductClicks',
            subFormat: v => `${v} no top produto`,
            icon: MousePointer,
            color: 'text-orange-400',
          },
          {
            label: 'Conversões',
            field: 'conversions',
            value: s.conversions,
            format: v => String(v),
            subField: 'conversionRate',
            subFormat: v => `${v}% de conversão`,
            subStep: 0.1,
            icon: TrendingUp,
            color: 'text-emerald-400',
          },
          {
            label: 'Comissão total',
            field: 'commissionTotal',
            value: s.commissionTotal,
            format: brl,
            step: 0.01,
            subField: 'commissionThisMonth',
            subFormat: v => `${brl(v)} este mês`,
            subStep: 0.01,
            icon: DollarSign,
            color: 'text-yellow-400',
          },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{k.label}</span>
              <k.icon size={14} className={k.color} />
            </div>
            <EditableField
              value={k.value}
              onChange={v => update('shopee', k.field, v)}
              format={k.format}
              step={k.step ?? 1}
              label={k.label}
              className="text-xl font-bold text-white"
            />
            <EditableField
              value={s[k.subField]}
              onChange={v => update('shopee', k.subField, v)}
              format={k.subFormat}
              step={k.subStep ?? 1}
              label={k.subField}
              className="text-xs text-gray-500 mt-0.5"
            />
          </div>
        ))}
      </div>

      {/* Top product */}
      <div className="card mb-4 flex items-center gap-4 bg-orange-950/20 border-orange-900/30">
        <div className="w-10 h-10 rounded-xl bg-orange-900/40 flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={18} className="text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Produto mais clicado</p>
          <p className="text-sm font-semibold text-white">{s.topProductName}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <EditableField
            value={s.topProductClicks}
            onChange={v => update('shopee', 'topProductClicks', v)}
            label="Cliques top produto"
            className="text-xl font-bold text-orange-400"
          />
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
