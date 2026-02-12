import { useRef, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  franchiseSearch: string;
  setFranchiseSearch: (v: string) => void;
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
  sortNew: boolean;
  setSortNew: Dispatch<SetStateAction<boolean>>;
};

// Hook pour charger le symbole de chaque franchise
const useFranchiseSymbol = (category: string) => {
  const franchiseSymbolUrl = `https://utnweavpbajitnjsuxff.supabase.co/storage/v1/object/public/symbols/${category}.svg`;
  const defaultSymbolUrl =
    "https://utnweavpbajitnjsuxff.supabase.co/storage/v1/object/public/symbols/other.svg";

  const [symbolUrl, setSymbolUrl] = useState(franchiseSymbolUrl);

  useEffect(() => {
    const checkSymbolExists = async () => {
      try {
        const response = await fetch(franchiseSymbolUrl, { method: "HEAD" });
        if (!response.ok) {
          setSymbolUrl(defaultSymbolUrl);
        }
      } catch {
        setSymbolUrl(defaultSymbolUrl);
      }
    };

    checkSymbolExists();
  }, [franchiseSymbolUrl, defaultSymbolUrl]);

  return symbolUrl;
};

export const FilterBar = ({
  search,
  setSearch,
  franchiseSearch,
  setFranchiseSearch,
  categories,
  selectedCategories,
  toggleCategory,
  categoryCounts,
  sortNew,
  setSortNew,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const momentumId = useRef<number | null>(null);
  const hasDragged = useRef(false);
  const DRAG_THRESHOLD = 6;

  const stopMomentum = () => {
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
  };

  const snapToNearest = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];

    let closest = children[0];
    let closestDist = Infinity;

    children.forEach((child) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      const dist = Math.abs(containerCenter - childCenter);

      if (dist < closestDist) {
        closestDist = dist;
        closest = child;
      }
    });

    container.scrollTo({
      left:
        closest.offsetLeft -
        container.offsetWidth / 2 +
        closest.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    stopMomentum();
    setIsDragging(true);
    hasDragged.current = false;
    startX.current = e.pageX;
    startScroll.current = scrollRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();

    const dx = e.pageX - startX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged.current = true;
    }

    scrollRef.current.scrollLeft = startScroll.current - dx;

    const now = performance.now();
    const dt = now - lastTime.current;
    velocity.current = (lastX.current - e.pageX) / dt;

    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    applyMomentum();
  };

  const applyMomentum = () => {
    if (!scrollRef.current) return;
    let currentVelocity = velocity.current * 20;

    const step = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft += currentVelocity;
      currentVelocity *= 0.92;

      if (Math.abs(currentVelocity) > 0.5) {
        momentumId.current = requestAnimationFrame(step);
      } else {
        snapToNearest();
      }
    };

    momentumId.current = requestAnimationFrame(step);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search inputs and sort button */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search inputs */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search character..."
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all duration-300"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              🔍
            </span>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={franchiseSearch}
              onChange={(e) => setFranchiseSearch(e.target.value)}
              placeholder="Search franchise..."
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all duration-300"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              🎮
            </span>
          </div>
        </div>

        {/* Sort new button - full width on mobile, inline on desktop */}
        <button
          onClick={() => setSortNew((v) => !v)}
          className={`
            w-full lg:w-auto lg:flex-shrink-0 px-8 py-4 rounded-2xl font-bold uppercase text-sm tracking-wider
            backdrop-blur-xl border transition-all duration-300
            ${
              sortNew
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/50"
                : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10"
            }
          `}
        >
          <span className="flex items-center justify-center gap-2">
            {sortNew ? "✨" : "⭐"} New only
          </span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" })
          }
          className="shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          className={`
            flex gap-3 overflow-x-auto scrollbar-hide flex-1 py-2
            select-none
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          `}
        >
          {categories.map((cat) => {
            const active = selectedCategories.includes(cat);

            return (
              <CategoryButton
                key={cat}
                category={cat}
                active={active}
                count={categoryCounts[cat] ?? 0}
                onClick={(e) => {
                  if (hasDragged.current) {
                    e.preventDefault();
                    return;
                  }
                  toggleCategory(cat);
                }}
              />
            );
          })}
        </div>

        <button
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" })
          }
          className="shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

// Composant séparé pour chaque bouton de catégorie avec son symbole
const CategoryButton = ({
  category,
  active,
  count,
  onClick,
}: {
  category: string;
  active: boolean;
  count: number;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const symbolUrl = useFranchiseSymbol(category);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative shrink-0 px-6 py-3 rounded-2xl font-bold text-sm
        backdrop-blur-xl border whitespace-nowrap overflow-hidden
        flex items-center gap-3 transition-all duration-300
        ${
          active
            ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500/50 text-white shadow-lg shadow-purple-500/50 scale-105"
            : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:scale-105"
        }
      `}
    >
      {/* Symbole de franchise en arrière-plan */}
      <div className="absolute -left-1 w-10 h-10 opacity-30 z-0 pointer-events-none">
        <img
          src={symbolUrl}
          alt={`${category} symbol`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Contenu du bouton */}
      <span className="relative z-10">{category}</span>
      <span
        className={`
          relative z-10 text-xs px-2.5 py-1 rounded-full font-bold
          ${active ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"}
        `}
      >
        {count}
      </span>
    </button>
  );
};
