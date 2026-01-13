import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { IconCard } from "../components/IconCard"
import { FilterBar } from "../components/FilterBar"
import { Suggestion } from "./Suggestion"
import { CommissionBanner } from "../components/CommissionBanner"
import { SuggestionList } from "../components/SuggestionList"
import { QuizModal } from "../components/QuizModal"

import type { Icon } from "../types/icon"

export const Gallery = () => {
  const [icons, setIcons] = useState<Icon[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false)
  const [franchiseSearch, setFranchiseSearch] = useState("")
  // const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  // 🔹 Fetch Supabase
  useEffect(() => {
    const fetchIcons = async () => {
      const { data, error } = await supabase
        .from("icons")
        .select("*")

      if (!error && data) {
        setIcons(data)
      }

      setLoading(false)
    }

    fetchIcons()
  }, [])

  // 🔹 Catégories uniques
  const categories = Array.from(new Set(icons.map(i => i.category)))

  // 🔹 Compteur par catégorie
  const categoryCounts = icons.reduce<Record<string, number>>((acc, icon) => {
    acc[icon.category] = (acc[icon.category] || 0) + 1
    return acc
  }, {})

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  // 🔹 Filtres
  const filteredIcons = icons
    .filter(icon => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(icon.category)

      const matchesName = icon.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFranchise = icon.category
        .toLowerCase()
        .includes(franchiseSearch.toLowerCase())

      return matchesCategory && matchesName && matchesFranchise
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  // 🔥 Regroupement par character_id
  const groupedIcons = Object.values(
    filteredIcons.reduce<Record<string, Icon[]>>((acc, icon) => {
      if (!acc[icon.character_id]) acc[icon.character_id] = []
      acc[icon.character_id].push(icon)
      return acc
    }, {})
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <CommissionBanner />
      {/* Header */}
      <div className="px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest">
            SMASH HEAD ICONS
          </h1>
          <p className="text-zinc-400 mt-2 uppercase tracking-wider text-sm">
            Choose your fighter
          </p>
          <p className="mt-2 text-xs">Icons made by GabUn</p>
          <p className="mt-2 text-xs">
            All characters and franchises belong to their respective owners.
            This is a fan-made project and is not affiliated with or endorsed by any studio.
          </p>
          <p className="mt-2 text-xs">
            You can freely use them for personal projects. For other types of projects,
            please send me a message. Thanks!
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="px-3 py-1 text-sm font-bold">
              🎨 {icons.length} icons
            </span>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setQuizOpen(true)}
              className="
                flex items-center gap-2
                px-6 py-3
                rounded-xl
                bg-zinc-800
                border border-zinc-700
                font-bold uppercase text-sm
                hover:border-yellow-400
                hover:text-yellow-400
                transition
              "
            >
              🎮 Test Mode
            </button>
          </div>

        </header>

        {/* Filters */}
        <div className="mb-10">
          <FilterBar
            search={search}
            setSearch={setSearch}
            franchiseSearch={franchiseSearch}
            setFranchiseSearch={setFranchiseSearch}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-zinc-400">Loading icons...</p>
        )} 

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {groupedIcons.map(group => (
              <IconCard
              key={group[0].character_id}
              icons={group}
              />
            ))}
          </div>
        )}

        {quizOpen && (
          <QuizModal
            icons={icons}
            onClose={() => setQuizOpen(false)}
          />
        )}

        {/* Bouton suggestion */}
        <button
          onClick={() => setIsSuggestionOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full
          text-black font-bold text-lg shadow-lg
          hover:bg-yellow-500 transition
          flex items-center justify-center z-50"
          >
          💡
        </button>

        <button
          onClick={() => setIsSuggestionListOpen(true)}
          className="fixed bottom-6 right-24 w-16 h-16 rounded-full
                    text-black font-bold text-lg shadow-lg
                    hover:bg-yellow-500 transition
                    flex items-center justify-center z-50"
          title="Already suggested characters"
        >
          📋
        </button>

        {/* Mail */}
        <a
          href="mailto:gabin.guerin1@gmail.com?subject=Message from Shi"
          className="fixed bottom-6 left-6 w-16 h-16 rounded-full
          text-black font-bold text-lg shadow-lg
          hover:bg-yellow-500 transition
          flex items-center justify-center z-50"
          title="Send me an email"
        >
          📧
        </a>

        {/* Portfolio */}
        <a
          href="https://gabun-portfolio.vercel.app/"
          className="fixed bottom-6 left-24 w-16 h-16 rounded-full
          text-black font-bold text-lg shadow-lg
          hover:bg-yellow-500 transition
          flex items-center justify-center z-50"
          title="See my portolio"
          target="_blank"
        >
          👤
        </a>

        {/* Modale suggestion */}
        {isSuggestionOpen && (
          <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setIsSuggestionOpen(false)}
          >
            <div
              className="bg-zinc-900 p-6 rounded-lg max-w-md w-full"
              onClick={e => e.stopPropagation()}
              >
              <Suggestion />
              <button
                onClick={() => setIsSuggestionOpen(false)}
                className="mt-4 bg-red-600 px-4 py-2 rounded font-bold text-sm"
                >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modale liste */}
        {isSuggestionListOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
            onClick={() => setIsSuggestionListOpen(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 rounded-lg w-full max-w-5xl
                        max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header fixe */}
              <div
                className="flex items-center justify-between
                          px-6 py-4 border-b border-zinc-700"
              >
                <h2 className="font-extrabold tracking-widest uppercase text-sm sm:text-base">
                  Already suggested characters
                </h2>

                <button
                  onClick={() => setIsSuggestionListOpen(false)}
                  className="w-10 h-10 flex items-center justify-center
                            text-zinc-400 hover:text-white
                            hover:bg-zinc-800 rounded-full transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="p-6 overflow-y-auto">
                <SuggestionList />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
