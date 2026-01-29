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
    return <p className="text-center text-zinc-400">Loading suggestions...</p>;
  }

  const nextCharacters =
    nextFranchise && data[nextFranchise] ? data[nextFranchise] : [];

  return (
    <div className="flex flex-col gap-10">
      {/* Progress + Next franchise */}
      <div className="flex flex-col items-center md:flex-row md:items-stretch md:justify-center gap-8">
        {nextFranchise && (
          <div
            className="
              w-full md:max-w-sm
              rounded-2xl p-6
              bg-gradient-to-br from-yellow-400/20 to-yellow-600/10
              border-2 border-yellow-400
              shadow-[0_0_30px_rgba(250,204,21,0.25)]
              flex flex-col
            "
          >
            <p className="text-xs tracking-widest text-yellow-300">
              Next to be done
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-yellow-400 uppercase">
              {nextFranchise}
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {nextCharacters.map((char) => (
                <span
                  key={char.id}
                  className="
                    px-3 py-1 rounded-full text-xs
                    bg-zinc-900/80
                    border border-yellow-400/40
                    text-yellow-200
                  "
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
              className="rounded-2xl p-4 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-cyan-400/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-extrabold shrink-0">
                  {index + 1}
                </span>

                <h3 className="uppercase tracking-widest text-sm font-bold text-cyan-300">
                  {franchise}
                </h3>

                <span className="ml-auto text-xs font-bold bg-yellow-400 text-black px-3 py-1 rounded-full">
                  {characters.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {characters.map((char) => (
                  <span
                    key={char.id}
                    className="
                      px-3 py-1 rounded-full text-xs
                      bg-zinc-800 hover:bg-cyan-400/20
                      border border-zinc-700
                      transition
                    "
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
