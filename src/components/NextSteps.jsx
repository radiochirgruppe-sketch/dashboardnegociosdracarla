import { CheckSquare, Square, ListTodo } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { nextSteps } from '../data/mockData'

export default function NextSteps() {
  const done = nextSteps.filter(s => s.done).length
  const total = nextSteps.length

  return (
    <section>
      <SectionHeading
        icon={ListTodo}
        title="Próximos Passos e Oportunidades"
        badge={`${done}/${total} concluídos`}
        color="text-emerald-400"
      />
      <div className="card space-y-2">
        {nextSteps.map(step => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
              step.done ? 'bg-emerald-900/10 border border-emerald-900/20' : 'bg-gray-800/40'
            }`}
          >
            {step.done
              ? <CheckSquare size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              : <Square size={16} className="text-gray-600 flex-shrink-0 mt-0.5" />
            }
            <span className={`text-sm leading-snug ${step.done ? 'text-emerald-300 line-through decoration-emerald-700/50' : 'text-gray-300'}`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
