import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useRelativeTime } from '../hooks/useAutoFetch'

/**
 * Barra de status de uma fonte de dados.
 * Mostra: "Ao vivo · atualizado há X min [↻]"
 */
export default function DataStatus({ loading, error, lastTs, isFresh, onRefresh, label = 'dados' }) {
  const relTime = useRelativeTime(lastTs)

  if (!lastTs && !loading && !error) return null   // API key ausente — silencioso

  return (
    <div className={`flex items-center gap-2 text-xs mb-4 px-3 py-2 rounded-lg border transition-colors ${
      error
        ? 'bg-red-900/20 border-red-900/30 text-red-400'
        : isFresh
          ? 'bg-emerald-900/20 border-emerald-900/30 text-emerald-400'
          : 'bg-gray-800/60 border-gray-700/40 text-gray-500'
    }`}>
      {loading ? (
        <RefreshCw size={12} className="animate-spin text-brand-400" />
      ) : error ? (
        <AlertCircle size={12} />
      ) : isFresh ? (
        <CheckCircle2 size={12} />
      ) : (
        <Clock size={12} />
      )}

      <span>
        {loading
          ? `Buscando ${label}…`
          : error
            ? `Erro: ${error}`
            : `Ao vivo · ${relTime}`}
      </span>

      {!loading && onRefresh && (
        <button
          onClick={onRefresh}
          title="Atualizar agora"
          className="ml-auto p-0.5 rounded hover:text-white transition-colors"
        >
          <RefreshCw size={11} />
        </button>
      )}
    </div>
  )
}
