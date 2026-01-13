import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "seenCharacters"

export const useSeenCharacters = () => {
  const [seen, setSeen] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setSeen(JSON.parse(stored))
    }
  }, [])

  const markAsSeen = useCallback((id: string) => {
    setSeen(prev => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const hasSeen = useCallback(
    (id: string) => seen.includes(id),
    [seen]
  )

  return { hasSeen, markAsSeen }
}
