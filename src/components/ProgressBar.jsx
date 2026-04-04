export default function ProgressBar({ value, max, label, sublabel, color = 'bg-brand-500', showPercent = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-medium">
          {value.toLocaleString('pt-BR')} / {max.toLocaleString('pt-BR')}
          {showPercent && <span className="text-gray-500 ml-1">({pct}%)</span>}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {sublabel && <p className="text-xs text-gray-600">{sublabel}</p>}
    </div>
  )
}
