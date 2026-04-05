import { useState, useEffect, useCallback, useRef } from 'react'

const CACHE_PREFIX = 'dashboard_cache_'

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, ts, ttl } = JSON.parse(raw)
    if (Date.now() - ts > ttl) return null   // expirado
    return { data, ts }
  } catch {
    return null
  }
}

function setCache(key, data, ttl) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now(), ttl }))
  } catch { /* quota exceeded — ignora */ }
}

/**
 * Hook genérico de busca com cache + auto-refresh.
 *
 * @param {string}   cacheKey   — chave única para o cache (localStorage)
 * @param {Function} fetcher    — async fn que retorna os dados
 * @param {object}   options
 *   ttl          — tempo de vida do cache em ms (default: 30 min)
 *   refreshMs    — intervalo de auto-refresh em ms (default: 30 min, 0 = desligado)
 *   enabled      — false = não busca (ex: chave de API ausente)
 */
export function useAutoFetch(cacheKey, fetcher, { ttl = 30 * 60_000, refreshMs = 30 * 60_000, enabled = true } = {}) {
  const cached = getCached(cacheKey)

  const [data,    setData]    = useState(cached?.data ?? null)
  const [loading, setLoading] = useState(enabled && !cached)
  const [error,   setError]   = useState(null)
  const [lastTs,  setLastTs]  = useState(cached?.ts ?? null)
  const [isFresh, setIsFresh] = useState(false)  // acabou de buscar agora

  const timerRef    = useRef(null)
  const mountedRef  = useRef(true)

  const fetch_ = useCallback(async (silent = false) => {
    if (!enabled) return
    if (!silent) setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      if (!mountedRef.current) return

      setData(result)
      setLastTs(Date.now())
      setIsFresh(true)
      setCache(cacheKey, result, ttl)

      setTimeout(() => { if (mountedRef.current) setIsFresh(false) }, 3000)
    } catch (e) {
      if (!mountedRef.current) return
      setError(e.message)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [cacheKey, fetcher, ttl, enabled])

  // Busca inicial
  useEffect(() => {
    if (!enabled) return

    // Se o cache ainda é válido, não rebusca
    const fresh = getCached(cacheKey)
    if (fresh) {
      setData(fresh.data)
      setLastTs(fresh.ts)
      setLoading(false)
      return
    }

    fetch_()
  }, [enabled])   // só na montagem

  // Auto-refresh
  useEffect(() => {
    if (!enabled || !refreshMs) return
    timerRef.current = setInterval(() => fetch_(true), refreshMs)
    return () => clearInterval(timerRef.current)
  }, [enabled, refreshMs, fetch_])

  // Cleanup
  useEffect(() => () => { mountedRef.current = false }, [])

  return {
    data,
    loading,
    error,
    lastTs,
    isFresh,
    refresh: () => fetch_(false),
  }
}

/** Formata "há X min" ou "há X h" a partir de um timestamp */
export function useRelativeTime(ts) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!ts) return
    function update() {
      const diff = Math.floor((Date.now() - ts) / 1000)
      if (diff < 60)        setLabel('agora mesmo')
      else if (diff < 3600) setLabel(`há ${Math.floor(diff / 60)} min`)
      else                  setLabel(`há ${Math.floor(diff / 3600)} h`)
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [ts])

  return label
}
