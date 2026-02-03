import { useState } from "react";
import type { Icon } from "../types/icon";

type Props = {
  icons: Icon[];
  hasSeen: (id: string) => boolean;
  markAsSeen: (id: string) => void;
};

export const IconCard = ({ icons, hasSeen, markAsSeen }: Props) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const hasMultiple = icons.length > 1;
  const icon = icons[index];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + icons.length) % icons.length);
  };

  const characterId = icons[0].character_id;
  const isNew = !hasSeen(characterId);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % icons.length);
  };

  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="group relative cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 aspect-square transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20"
      >
        {/* New indicator */}
        {isNew && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 shadow-lg shadow-cyan-400/50"></span>
            </span>
          </div>
        )}

        {/* Count badge */}
        {hasMultiple && (
          <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
            {icons.length}
          </div>
        )}

        {/* Image container */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <img
            src={icon.svgpath ?? icon.pngpath}
            alt={icon.name}
            className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          />
        </div>

        {/* Navigation arrows - always visible on mobile, show on hover on desktop */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 z-20"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 z-20"
            >
              ▶
            </button>
          </>
        )}

        {/* Name */}
        <div className="mt-3 space-y-1">
          <p
            className="text-sm font-semibold text-center truncate w-full"
            title={icon.name}
          >
            {icon.name}
          </p>
          <p
            className="text-xs text-center text-gray-400 truncate w-full uppercase tracking-wider"
            title={icons[0].category}
          >
            {icons[0].category}
          </p>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => {
            setOpen(false);
            markAsSeen(characterId);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-purple-500/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20 animate-scaleIn"
          >
            {/* Image */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <img
                src={icon.svgpath ?? icon.pngpath}
                alt={icon.name}
                className="block mx-auto max-w-full max-h-[50vh] object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              />
            </div>

            {/* Info */}
            <div className="text-center space-y-4">
              <div>
                <p className="text-2xl font-bold tracking-tight">{icon.name}</p>
                <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">
                  {icons[0].category}
                </p>
              </div>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                {icon.pngpath && (
                  <button
                    onClick={() => {
                      if (!icon.pngpath) return;
                      downloadFile(icon.pngpath, `${icon.name}.png`);
                    }}
                    className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10">Download PNG</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}

                {icon.svgpath && (
                  <button
                    onClick={() => {
                      if (!icon.svgpath) return;
                      downloadFile(icon.svgpath, `${icon.name}.svg`);
                    }}
                    className="w-full sm:w-auto group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/30"
                  >
                    Download SVG
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
