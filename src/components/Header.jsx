import { LayoutDashboard, RefreshCw, Pencil, Check, X, RotateCcw } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Header({ lastUpdated }) {
  const { editMode, setEditMode, save, resetToDefaults, data } = useData()

  const savedAt = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo / title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 leading-none mb-0.5">Ecossistema</p>
            <h1 className="text-sm font-semibold text-white truncate">Dra. Carla Menini</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Última atualização */}
          {!editMode && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <RefreshCw size={11} />
              {savedAt
                ? <span>Salvo em <span className="text-gray-400 font-medium">{savedAt}</span></span>
                : <span className="text-gray-600">{lastUpdated}</span>
              }
            </div>
          )}

          {/* Modo edição: botões Salvar + Cancelar + Resetar */}
          {editMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaults}
                title="Redefinir para valores padrão"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Redefinir</span>
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <X size={13} /> Cancelar
              </button>

              <button
                onClick={save}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-brand-600 hover:bg-brand-500 transition-colors"
              >
                <Check size={13} /> Salvar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <Pencil size={12} /> Editar dados
            </button>
          )}
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="bg-brand-900/40 border-b border-brand-800/50 px-4 py-2 text-center text-xs text-brand-300">
          Modo de edição ativo — clique em qualquer número para atualizar. Clique em <strong>Salvar</strong> para confirmar.
        </div>
      )}
    </header>
  )
}
