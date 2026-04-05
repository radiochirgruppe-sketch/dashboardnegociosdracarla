import { Mail, Zap } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import ProgressBar from './ProgressBar'
import DataStatus from './DataStatus'
import { newsletters as mockNewsletters, newsletterWeekly } from '../data/mockData'
import { useBeehiiv } from '../hooks/useBeehiiv'

const GOALS = { 'Medicina Simbólica': 500, 'Desafios Online': 2500 }
const COLORS = { 'Medicina Simbólica': '#a855f7', 'Desafios Online': '#22c55e' }

const TooltipStyle = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {Number(p.value).toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  )
}

export default function NewsletterSection() {
  const { data: realData, loading, error, lastTs, isFresh, refresh } = useBeehiiv()

  const newsletters = realData?.length ? realData : mockNewsletters
  const isReal      = !!realData?.length

  return (
    <section>
      <SectionHeading
        icon={Mail}
        title="Newsletter — Beehiiv"
        badge={isReal ? 'ao vivo ✓' : '2 newsletters ativas'}
        color="text-yellow-400"
      />

      <DataStatus
        loading={loading}
        error={error}
        lastTs={lastTs}
        isFresh={isFresh}
        onRefresh={refresh}
        label="Beehiiv"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {newsletters.map(nl => {
          const goal  = nl.subscribersGoal ?? GOALS[nl.name] ?? 1000
          const color = COLORS[nl.name] ?? '#a855f7'
          return (
            <div key={nl.name} className="card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{nl.name}</p>
                  <p className="text-xs text-gray-500">{nl.frequency}</p>
                </div>
                {nl.adsenseEligible && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40">
                    <Zap size={10} /> Elegível Monetização
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-800/60 rounded-lg p-2">
                  <p className="text-base font-bold text-white">{nl.subscribers.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-500">Inscritos</p>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2">
                  <p className="text-base font-bold text-white">
                    {nl.openRate != null ? `${nl.openRate}%` : '—'}
                  </p>
                  <p className="text-xs text-gray-500">Abertura</p>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2">
                  <p className="text-base font-bold text-white">
                    {nl.clickRate != null ? `${nl.clickRate}%` : '—'}
                  </p>
                  <p className="text-xs text-gray-500">Cliques</p>
                </div>
              </div>

              <ProgressBar
                value={nl.subscribers}
                max={goal}
                label={`Meta: ${goal.toLocaleString('pt-BR')} inscritos`}
                color={nl.adsenseEligible ? 'bg-emerald-500' : 'bg-yellow-500'}
              />

              <p className="text-xs text-gray-600">Última edição: {nl.lastIssueDate}</p>
            </div>
          )
        })}
      </div>

      <div className="card">
        <p className="text-sm font-medium text-gray-300 mb-4">
          Crescimento de inscritos (semanal — histórico estimado)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={newsletterWeekly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="msGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="doGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipStyle />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            <Area type="monotone" dataKey="medicinasimbolica" stroke="#a855f7" fill="url(#msGrad)" strokeWidth={2} name="Medicina Simbólica" dot={false} />
            <Area type="monotone" dataKey="desafiosonline"    stroke="#22c55e" fill="url(#doGrad)"  strokeWidth={2} name="Desafios Online"    dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
