import { Mail, Zap, Loader2 } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeading from './SectionHeading'
import ProgressBar from './ProgressBar'
import { newsletters as mockNewsletters, newsletterWeekly } from '../data/mockData'
import { useBeehiiv } from '../hooks/useBeehiiv'

// ─── Coloque aqui os IDs reais das suas newsletters ───────────────
// Obtenha rodando:
//   curl https://api.beehiiv.com/v2/publications \
//     -H "Authorization: Bearer SEU_TOKEN"
const PUB_IDS = [
  // { id: 'pub_XXXXXXXX', name: 'Medicina Simbólica' },
  // { id: 'pub_YYYYYYYY', name: 'Desafios Online' },
]

function fmt(n) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n }

const TooltipStyle = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  )
}

export default function NewsletterSection() {
  const { data: realData, loading, error } = useBeehiiv(PUB_IDS)

  // Usa dados reais se disponíveis, senão usa mock
  const newsletters = (realData && realData.length > 0) ? realData : mockNewsletters
  const isReal      = realData && realData.length > 0

  return (
    <section>
      <SectionHeading
        icon={Mail}
        title="Newsletter — Beehiiv"
        badge={isReal ? 'dados reais ✓' : '2 newsletters ativas'}
        color="text-yellow-400"
      />

      {loading && PUB_IDS.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Loader2 size={14} className="animate-spin" /> Buscando dados do Beehiiv...
        </div>
      )}
      {error && (
        <div className="text-xs text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2 mb-4">
          Erro ao conectar Beehiiv: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {newsletters.map(nl => (
          <div key={nl.name} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{nl.name}</p>
                <p className="text-xs text-gray-500">{nl.frequency}</p>
              </div>
              {nl.adsenseEligible && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40">
                  <Zap size={10} />
                  Elegível Monetização
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-800/60 rounded-lg p-2">
                <p className="text-base font-bold text-white">{nl.subscribers.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-500">Inscritos</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-2">
                <p className="text-base font-bold text-white">{nl.openRate}%</p>
                <p className="text-xs text-gray-500">Abertura</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-2">
                <p className="text-base font-bold text-white">{nl.clickRate}%</p>
                <p className="text-xs text-gray-500">Cliques</p>
              </div>
            </div>

            <ProgressBar
              value={nl.subscribers}
              max={nl.subscribersGoal}
              label={`Meta: ${nl.subscribersGoal.toLocaleString('pt-BR')} inscritos`}
              color={nl.adsenseEligible ? 'bg-emerald-500' : 'bg-yellow-500'}
            />

            <p className="text-xs text-gray-600">Última edição: {nl.lastIssueDate}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-sm font-medium text-gray-300 mb-4">Crescimento de inscritos (semanal)</p>
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
            <Area type="monotone" dataKey="desafiosonline" stroke="#22c55e" fill="url(#doGrad)" strokeWidth={2} name="Desafios Online" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
