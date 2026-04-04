import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KPICard({ label, value, trend, trendLabel, icon: Icon, iconColor = 'text-brand-400', subtitle }) {
  const trendNum = typeof trend === 'number' ? trend : null

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg bg-gray-800 ${iconColor}`}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {trendNum !== null && (
        <div className={trendNum >= 0 ? 'trend-up' : 'trend-down'}>
          {trendNum > 0 ? <TrendingUp size={12} /> : trendNum < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{trendNum > 0 ? '+' : ''}{trendNum}%</span>
          {trendLabel && <span className="text-gray-500 ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
