import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  instagramProfiles as defaultIG,
  tiktokStats as defaultTT,
  shopeeStats as defaultShopee,
  metaAdsStats as defaultMeta,
  youtubeStats as defaultYT,
} from '../data/mockData'

const STORAGE_KEY = 'dashboard_carla_manual_data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function buildDefaults() {
  return {
    instagram: defaultIG.map(p => ({ ...p })),
    tiktok: { ...defaultTT },
    shopee: { ...defaultShopee },
    meta: { ...defaultMeta },
    youtube: { watchHours: defaultYT.watchHours },
    lastUpdated: null,
  }
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [editMode, setEditMode]   = useState(false)
  const [data, setData]           = useState(() => loadFromStorage() ?? buildDefaults())
  const [dirty, setDirty]         = useState(false)

  // Persiste no localStorage sempre que os dados mudarem
  useEffect(() => {
    if (dirty) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setDirty(false)
    }
  }, [data, dirty])

  // Atualiza um campo aninhado de forma genérica
  // ex: update('tiktok', 'followers', 4500)
  const update = useCallback((section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section] // arrays tratados separadamente
        : { ...prev[section], [field]: value },
    }))
    setDirty(true)
  }, [])

  // Atualiza um perfil do Instagram por índice
  const updateIG = useCallback((index, field, value) => {
    setData(prev => {
      const next = [...prev.instagram]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, instagram: next }
    })
    setDirty(true)
  }, [])

  const save = useCallback(() => {
    setData(prev => ({ ...prev, lastUpdated: new Date().toISOString() }))
    setDirty(true)
    setEditMode(false)
  }, [])

  const resetToDefaults = useCallback(() => {
    const defaults = buildDefaults()
    setData(defaults)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
  }, [])

  return (
    <DataContext.Provider value={{ data, editMode, setEditMode, update, updateIG, save, resetToDefaults }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
