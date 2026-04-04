import { LayoutDashboard, RefreshCw } from 'lucide-react'

export default function Header({ lastUpdated }) {
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

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <RefreshCw size={12} />
          <span className="hidden sm:inline">Atualizado em</span>
          <span className="font-medium text-gray-400">{lastUpdated}</span>
        </div>
      </div>
    </header>
  )
}
