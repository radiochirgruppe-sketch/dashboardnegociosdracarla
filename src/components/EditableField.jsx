import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { useData } from '../context/DataContext'

/**
 * Campo editável inline.
 * Em modo de visualização: mostra o valor formatado.
 * Em modo de edição: vira um input numérico ou de texto.
 *
 * Props:
 *   value      — valor atual (number ou string)
 *   onChange   — fn(newValue) chamada ao confirmar
 *   format     — fn(value) → string para exibição (opcional)
 *   type       — 'number' | 'text' (default: 'number')
 *   step       — passo do input numérico (default: 1)
 *   className  — classes extras no wrapper
 *   label      — label acessível (opcional)
 */
export default function EditableField({
  value,
  onChange,
  format,
  type = 'number',
  step = 1,
  className = '',
  label,
}) {
  const { editMode } = useData()
  const [editing, setEditing]   = useState(false)
  const [local, setLocal]       = useState(value)
  const inputRef                = useRef(null)

  useEffect(() => { setLocal(value) }, [value])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  if (!editMode) {
    return <span className={className}>{format ? format(value) : value}</span>
  }

  function confirm() {
    const parsed = type === 'number' ? Number(local) : local
    onChange(parsed)
    setEditing(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter') confirm()
    if (e.key === 'Escape') { setLocal(value); setEditing(false) }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        step={step}
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={confirm}
        onKeyDown={handleKey}
        aria-label={label}
        className={`bg-gray-700 border border-brand-500 rounded px-1.5 py-0.5 text-white outline-none w-full ${className}`}
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title={`Editar: ${label ?? value}`}
      className={`group inline-flex items-center gap-1 rounded hover:bg-gray-700/60 px-1 -mx-1 transition-colors cursor-text ${className}`}
    >
      <span>{format ? format(value) : value}</span>
      <Pencil size={10} className="text-gray-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
    </button>
  )
}
