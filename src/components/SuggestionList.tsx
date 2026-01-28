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

      setLoading(false);
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return <p className="text-center text-zinc-400">Loading suggestions...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Progress wheel */}
      <div className="flex justify-center">
        <ProgressWheel done={iconsCount} toDo={totalSuggestions} />
      </div>

      {/* Franchises */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(data)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([franchise, characters]) => (
            <div
              key={franchise}
              className="
                rounded-2xl p-4
                bg-gradient-to-br from-zinc-900/80 to-zinc-800/80
                border border-cyan-400/20
              "
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="uppercase tracking-widest text-sm font-bold text-cyan-300">
                  {franchise}
                </h3>
                <span className="text-xs font-bold bg-yellow-400 text-black px-3 py-1 rounded-full">
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
