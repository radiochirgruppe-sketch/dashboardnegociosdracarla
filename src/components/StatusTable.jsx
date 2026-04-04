import { Activity } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { automationStatus } from '../data/mockData'

function StatusBadge({ status }) {
  const map = {
    'Rodando':    'badge-active',
    'Ativo':      'badge-active',
    'Em curso':   'badge-active',
    'Concluído':  'badge-done',
    'Pausado':    'badge-pending',
  }
  const cls = map[status] || 'badge-pending'
  return (
    <span className={cls}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      {status}
    </span>
  )
}

export default function StatusTable() {
  return (
    <section>
      <SectionHeading icon={Activity} title="Mapa de Automações — Status Consolidado" color="text-brand-400" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
              <th className="text-left py-3 pr-4">Automação</th>
              <th className="text-left py-3 pr-4">Canal</th>
              <th className="text-left py-3 pr-4">Ferramenta</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {automationStatus.map(row => (
              <tr key={row.name} className="text-gray-300 hover:bg-gray-800/40 transition-colors">
                <td className="py-3 pr-4 font-medium text-white">{row.name}</td>
                <td className="py-3 pr-4 text-gray-400">{row.channel}</td>
                <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{row.tool}</td>
                <td className="py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
