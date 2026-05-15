import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'favorites'
const EVENT_NAME = 'favoritesUpdated'

function loadFromStorage(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useFavorites(availableProductIds?: string[]) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const isExternalUpdate = useRef(false)

  // Load on mount
  useEffect(() => {
    setFavorites(loadFromStorage())
    setMounted(true)
  }, [])

  const productIdsKey = availableProductIds?.join(',') ?? ''

  // Remove orphaned favorites when product list is available
  useEffect(() => {
    if (!mounted || !availableProductIds || availableProductIds.length === 0) return
    setFavorites(prev => {
      const cleaned = prev.filter(id => availableProductIds.includes(id))
      if (cleaned.length !== prev.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
        window.dispatchEvent(new Event(EVENT_NAME))
      }
      return cleaned
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, productIdsKey])

  // Listen for updates from other hook instances
  useEffect(() => {
    const handleExternal = () => {
      isExternalUpdate.current = true
      setFavorites(loadFromStorage())
    }
    window.addEventListener(EVENT_NAME, handleExternal)
    return () => window.removeEventListener(EVENT_NAME, handleExternal)
  }, [])

  // Save to localStorage and notify other instances
  useEffect(() => {
    if (!mounted) return
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    window.dispatchEvent(new Event(EVENT_NAME))
  }, [favorites, mounted])

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const isFavorited = (productId: string) => favorites.includes(productId)

  return {
    favorites,
    toggleFavorite,
    isFavorited,
    count: favorites.length,
  }
}
