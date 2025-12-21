import { useState } from "react"
import { icons } from "../data/icons"
import { IconCard } from "../components/IconCard"
import { FilterBar } from "../components/FilterBar"
import { Suggestion } from "./Suggestion"

export const Gallery = () => {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false)
  const categories = Array.from(new Set(icons.map(i => i.category)))

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  const filteredIcons = icons
    .filter((icon) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(icon.category)

      const matchesSearch = icon.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest">
          SMASH HEAD ICONS
        </h1>
        <p className="text-zinc-400 mt-2 uppercase tracking-wider text-sm">
          Choose your fighter
        </p>
        <p className="mt-2 text-xs">Icons made by GabUn</p>
        <p className="mt-2 text-xs">All characters and franchises belong to their respective owners. This is a fan-made project and is not affiliated with or endorsed by any studio.</p>
        <p className="mt-2 text-xs">You can freely use them for personal projects. For other types of projects, please send me a message. Thanks!</p>
      </header>

      {/* Filters */}
      <div className="mb-10">
        <FilterBar
          search={search}
          setSearch={setSearch}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {filteredIcons.map(icon => (
          <IconCard key={icon.id} icon={icon} />
        ))}
      </div>

      {/* Bouton flottant */}
      <button
        onClick={() => setIsSuggestionOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-black font-bold text-lg shadow-lg hover:bg-yellow-500 transition flex items-center justify-center z-50"
      >
        💡
      </button>
      <a
        href="mailto:gabin.guerin1@gmail.com?subject=Message from Shi"
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full text-black font-bold text-lg shadow-lg hover:bg-yellow-500 transition flex items-center justify-center z-50"
        title="Send me an email"
      >
        📧
      </a>


      {/* Modale */}
      {isSuggestionOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setIsSuggestionOpen(false)}
        >
          <div
            className="bg-zinc-900 p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
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
    </div>
  )
}
