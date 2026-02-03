import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ProgressWheel } from "./ProgressWheel";

type SuggestedCharacter = {
  id: string;
  character_name: string;
  franchise: string;
};

export const SuggestionList = () => {
  const [data, setData] = useState<Record<string, SuggestedCharacter[]>>({});
  const [loading, setLoading] = useState(true);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [iconsCount, setIconsCount] = useState(0);
  const [nextFranchise, setNextFranchise] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("icons")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        setIconsCount(count ?? 0);
      });
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from("suggested_characters")
        .select("*");

      if (!error && data) {
        const grouped = data.reduce<Record<string, SuggestedCharacter[]>>(
          (acc, char) => {
            if (!acc[char.franchise]) acc[char.franchise] = [];
            acc[char.franchise].push(char);
            return acc;
          },
          {},
        );

        setTotalSuggestions(data.length);
        setData(grouped);
      }

      const { data: firstSuggestion } = await supabase
        .from("suggested_characters")
        .select("franchise")
        .order("created_at", { ascending: true })
        .limit(1);

      if (firstSuggestion?.length) {
        setNextFranchise(firstSuggestion[0].franchise);
      }

      setLoading(false);
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading suggestions...</p>
      </div>
    );
  }

  const nextCharacters =
    nextFranchise && data[nextFranchise] ? data[nextFranchise] : [];

  return (
    <div className="flex flex-col gap-10">
      {/* Progress + Next franchise */}
      <div className="flex flex-col items-center md:flex-row md:items-stretch md:justify-center gap-8">
        {nextFranchise && (
          <div className="w-full md:max-w-md bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-purple-600/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <p className="text-xs uppercase tracking-widest text-purple-300 font-bold">
                Next in queue
              </p>
            </div>

            <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text uppercase text-transparent mb-6">
              {nextFranchise}
            </h3>

            <div className="flex flex-wrap gap-2">
              {nextCharacters.map((char) => (
                <span
                  key={char.id}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-500/20 border border-purple-400/30 text-purple-200 backdrop-blur-sm"
                >
                  {char.character_name}
                </span>
              ))}
            </div>
          </div>
        )}

        <ProgressWheel done={iconsCount} toDo={totalSuggestions} />
      </div>

      {/* Franchises grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(data)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([franchise, characters], index) => (
            <div
              key={franchise}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-black shadow-lg">
                  {index + 1}
                </span>

                <h3 className="uppercase tracking-wider text-base font-bold flex-1">
                  {franchise}
                </h3>

                <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                  {characters.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {characters.map((char) => (
                  <span
                    key={char.id}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    {char.character_name}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
