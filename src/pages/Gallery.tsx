import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { IconCard } from "../components/IconCard";
import { FilterBar } from "../components/FilterBar";
import { Suggestion } from "./Suggestion";
import { CommissionBanner } from "../components/CommissionBanner";
import { SuggestionList } from "../components/SuggestionList";
import { AdminSuggestionForm } from "../components/AdmnSuggestionForm";
import { QuizModal } from "../components/QuizModal";
import { useSeenCharacters } from "../hooks/useSeenCharacters";

import type { Icon } from "../types/icon";

export const Gallery = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);
  const [franchiseSearch, setFranchiseSearch] = useState("");
  const [sortNew, setSortNew] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { hasSeen, markAsSeen } = useSeenCharacters();

  useEffect(() => {
    const fetchIcons = async () => {
      const { data, error } = await supabase.from("icons").select("*");

      if (!error && data) {
        setIcons(data);
      }

      setLoading(false);
    };

    fetchIcons();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = Array.from(new Set(icons.map((i) => i.category)));

  const categoryCounts = icons.reduce<Record<string, number>>((acc, icon) => {
    acc[icon.category] = (acc[icon.category] || 0) + 1;
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredIcons = icons
    .filter((icon) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(icon.category);

      const matchesName = icon.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFranchise = icon.category
        .toLowerCase()
        .includes(franchiseSearch.toLowerCase());

      const matchesSeen = !sortNew || !hasSeen(icon.character_id);

      return matchesCategory && matchesName && matchesFranchise && matchesSeen;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupedIcons = Object.values(
    filteredIcons.reduce<Record<string, Icon[]>>((acc, icon) => {
      if (!acc[icon.character_id]) acc[icon.character_id] = [];
      acc[icon.character_id].push(icon);
      return acc;
    }, {}),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-white">
      {isAdmin && <AdminSuggestionForm onClose={() => setIsAdmin(false)} />}
      <CommissionBanner />

      {/* Main container with max width */}
      <div className="max-w-[1800px] mx-auto px-6 py-8 lg:px-12 lg:py-12">
        {/* Header */}
        <header className="mb-12">
          {/* Title and subtitle - centered */}
          <div className="text-center mb-8">
            <h1
              onDoubleClick={() => {
                const pass = prompt("Admin password?");
                if (pass === "sikour") {
                  setIsAdmin(true);
                }
              }}
              className="text-5xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
            >
              Smash Head Icons
            </h1>
            <p className="text-gray-400 mt-3 text-lg font-medium">
              Choose your fighter
            </p>
          </div>

          {/* Stats bubble - centered */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5">
              <span className="text-xl">🎨</span>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl font-bold">{icons.length}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  icons
                </p>
              </div>
            </div>
          </div>

          {/* Credits and info */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Created by GabUn</span> • All
              characters and franchises belong to their respective owners
            </p>
            <p className="text-sm text-gray-400">
              Free for personal use. For commercial projects, please contact me.
            </p>
          </div>

          {/* Quiz button - centered */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setQuizOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-8 py-4 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                🎮 Test Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            sortNew={sortNew}
            setSortNew={setSortNew}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading your icons...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {groupedIcons.map((group) => (
              <IconCard
                key={group[0].character_id}
                icons={group}
                hasSeen={hasSeen}
                markAsSeen={markAsSeen}
              />
            ))}
          </div>
        )}

        {quizOpen && (
          <QuizModal icons={icons} onClose={() => setQuizOpen(false)} />
        )}
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="group w-16 h-16 rounded-full 
               bg-white/10 backdrop-blur-xl border border-white/20 
               shadow-xl flex items-center justify-center 
               transition-all duration-300 
               hover:scale-110 hover:bg-white/20"
            title="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-8 h-8 text-white transition-transform duration-300 group-hover:-translate-y-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => setIsSuggestionOpen(true)}
          className="group w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl shadow-yellow-500/50 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:rotate-12"
          title="Suggest a character"
        >
          💡
        </button>

        <button
          onClick={() => setIsSuggestionListOpen(true)}
          className="group w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
          title="View suggestions"
        >
          📋
        </button>
      </div>

      {/* Bottom left buttons */}
      <div className="fixed bottom-8 left-8 flex gap-4 z-50">
        <a
          href="https://ko-fi.com/gabun"
          className="group w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 hover:bg-white/20"
          title="Support on Ko-fi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Ko-fi"
            src="/KoFiLogo.webp"
            className="w-10 h-10 object-contain"
          />
        </a>

        <a
          href="https://gabun-portfolio.vercel.app/"
          className="group w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
          title="View portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          👤
        </a>
      </div>

      {/* Suggestion Modal */}
      {isSuggestionOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSuggestionOpen(false)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Suggestion />
            <button
              onClick={() => setIsSuggestionOpen(false)}
              className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Suggestion List Modal */}
      {isSuggestionListOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSuggestionListOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
              <h2 className="font-bold text-2xl">Suggested Characters</h2>
              <button
                onClick={() => setIsSuggestionListOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto">
              <SuggestionList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
