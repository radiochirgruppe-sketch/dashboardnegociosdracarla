import { Target, DollarSign } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, Area,
} from 'recharts'
import SectionHeading from './SectionHeading'
import EditableField from './EditableField'
import { useData } from '../context/DataContext'
import { metaAdsWeekly } from '../data/mockData'

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }
function brl(n) { return `R$ ${Number(n).toFixed(2).replace('.', ',')}` }

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

const FIELDS = [
  { label: 'Investimento/mês', field: 'spendThisMonth', format: brl, step: 1, color: 'text-red-400',     subField: 'spendLastMonth',  subFormat: v => `vs mês ant: ${brl(v)}`,  subStep: 1 },
  { label: 'Alcance',          field: 'reach',           format: fmt,  step: 100, color: 'text-blue-400',   subField: null, sub: 'pessoas únicas' },
  { label: 'Impressões',       field: 'impressions',     format: fmt,  step: 100, color: 'text-purple-400', subField: null, sub: 'total' },
  { label: 'CTR',              field: 'ctr',             format: v => `${v}%`, step: 0.01, color: 'text-cyan-400', subField: 'cpc', subFormat: v => `CPC: R$ ${v}`, subStep: 0.01 },
  { label: 'Conversões',       field: 'conversions',     format: v => String(v), step: 1, color: 'text-emerald-400', subField: 'cpa', subFormat: v => `CPA: R$ ${v}`, subStep: 0.01 },
  { label: 'ROAS',             field: 'roas',            format: v => `${v}x`, step: 0.1, color: 'text-yellow-400', subField: null, sub: 'retorno sobre ad spend' },
]

export default function MetaAdsSection() {
  const { data, editMode, update } = useData()
  const s = data.meta

  return (
    <section>
      <SectionHeading icon={Target} title="Meta Ads — Tráfego Pago" badge="Assessoria MKT" color="text-blue-400" />

      {editMode && (
        <p className="text-xs text-brand-400 bg-brand-900/20 border border-brand-800/30 rounded-lg px-3 py-2 mb-4">
          Clique em qualquer número para editar. Fonte: painel Meta Ads → Resumo da conta.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {FIELDS.map(k => (
          <div key={k.label} className="card">
            <span className="stat-label block mb-2">{k.label}</span>
            <EditableField
              value={s[k.field]}
              onChange={v => update('meta', k.field, v)}
              format={k.format}
              step={k.step}
              label={k.label}
              className={`text-lg font-bold ${k.color}`}
            />
            {k.subField ? (
              <EditableField
                value={s[k.subField]}
                onChange={v => update('meta', k.subField, v)}
                format={k.subFormat}
                step={k.subStep}
                label={k.subField}
                className="text-xs text-gray-500 mt-0.5"
              />
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
            )}
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
