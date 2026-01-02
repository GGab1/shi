import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type SuggestedCharacter = {
  id: string
  character_name: string
  franchise: string
}

export const SuggestionList = () => {
  const [data, setData] = useState<Record<string, SuggestedCharacter[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("suggested_characters")
        .select("*")
        .order("franchise", { ascending: true })

      if (!error && data) {
        const grouped = data.reduce<Record<string, SuggestedCharacter[]>>(
          (acc, char) => {
            if (!acc[char.franchise]) acc[char.franchise] = []
            acc[char.franchise].push(char)
            return acc
          },
          {}
        )

        setData(grouped)
      }

      setLoading(false)
    }

    fetchSuggestions()
  }, [])

  if (loading) {
    return <p className="text-center text-zinc-400">Loading suggestions...</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(data).map(([franchise, characters], idx) => (
        <div
          key={franchise}
          className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
                          bg-zinc-800 border-b border-zinc-700">
            <h3 className="font-bold uppercase tracking-wide text-sm flex items-center gap-2">
              <span className="text-yellow-400 font-bold">{idx + 1}.</span>
              <span>{franchise}</span>
            </h3>
            <span className="text-xs bg-yellow-400 text-black
                            px-2 py-1 rounded-full font-bold">
              {characters.length}
            </span>
          </div>

          {/* List */}
          <ul className="max-h-40 overflow-y-auto divide-y divide-zinc-800">
            {characters.map(char => (
              <li
                key={char.id}
                className="px-4 py-2 text-sm hover:bg-zinc-800 transition"
              >
                {char.character_name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
