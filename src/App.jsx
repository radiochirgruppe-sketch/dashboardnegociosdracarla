import { useState } from 'react'
import Header from './components/Header'
import OverviewKPIs from './components/OverviewKPIs'
import InstagramSection from './components/InstagramSection'
import YouTubeSection from './components/YouTubeSection'
import TikTokSection from './components/TikTokSection'
import NewsletterSection from './components/NewsletterSection'
import ShopeeSection from './components/ShopeeSection'
import MetaAdsSection from './components/MetaAdsSection'
import StatusTable from './components/StatusTable'
import NextSteps from './components/NextSteps'

const NAV = [
  { id: 'instagram',   label: 'Instagram' },
  { id: 'youtube',     label: 'YouTube' },
  { id: 'tiktok',      label: 'TikTok' },
  { id: 'newsletter',  label: 'Newsletter' },
  { id: 'shopee',      label: 'Shopee' },
  { id: 'metaads',     label: 'Meta Ads' },
  { id: 'status',      label: 'Automações' },
  { id: 'nextsteps',   label: 'Próximos Passos' },
]

export default function App() {
  const [active, setActive] = useState(null)

  const scrollTo = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header lastUpdated="Abril 2026" />

      {/* Sticky sub-nav */}
      <nav className="sticky top-16 z-20 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active === n.id
                    ? 'bg-brand-700/40 text-brand-300'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Overview row */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Visão Geral — Todos os canais</h2>
          <OverviewKPIs />
        </div>

        <div id="instagram">
          <InstagramSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="youtube">
          <YouTubeSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="tiktok">
          <TikTokSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="newsletter">
          <NewsletterSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="shopee">
          <ShopeeSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="metaads">
          <MetaAdsSection />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="status">
          <StatusTable />
        </div>

        <div className="border-t border-gray-800/60" />

        <div id="nextsteps">
          <NextSteps />
        </div>

        <footer className="pt-4 pb-8 text-center text-xs text-gray-700">
          Dashboard — Ecossistema Dra. Carla Menini · Atualizado Abr/2026 · Dados via Metricool + Analytics
        </footer>
      </main>
    </div>
  )
}
