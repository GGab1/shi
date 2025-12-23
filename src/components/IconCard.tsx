import { useState } from "react"
import type { Icon } from "../types/icon"

type Props = {
  icons: Icon[]
}

export const IconCard = ({ icons }: Props) => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const hasMultiple = icons.length > 1
  const icon = icons[index]

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex(i => (i - 1 + icons.length) % icons.length)
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex(i => (i + 1) % icons.length)
  }

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="relative group cursor-pointer bg-zinc-900 border-2 border-zinc-700
                   rounded-md p-3 aspect-square
                   hover:scale-105 transition-all duration-200"
      >
        {/* Badge count */}
        {hasMultiple && (
          <div className="absolute top-2 right-2 bg-zinc-900 border-2 border-zinc-700 text-white
                          text-xs font-bold px-2 py-1 z-10 rounded-full">
            {icons.length}
          </div>
        )}

        {/* Image */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={icon.svgPath ?? icon.pngPath}
            alt={icon.name}
            className="max-w-full max-h-full object-contain
                       group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          />
        </div>

        {/* Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2
                         bg-black/60 text-white px-2 py-1 text-sm"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2
                         bg-black/60 text-white px-2 py-1 text-sm"
            >
              ▶
            </button>
          </>
        )}

        {/* Name */}
        <p
          className="mt-2 text-sm font-bold text-center truncate w-full"
          title={icon.name}
        >
          {icon.name}
        </p>


        {/* Category */}
        <p
          className="mt-1 text-center text-xs uppercase text-zinc-500 truncate w-full"
          title={icons[0].category}
        >
          {icons[0].category}
        </p>
      </div>

      {/* Modal preview */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-zinc-900 border-4 border-yellow-400
                       p-6 rounded-lg max-w-[90vw] max-h-[90vh]"
          >
            <img
              src={icon.svgPath ?? icon.pngPath}
              alt={icon.name}
              className="block mx-auto max-w-full max-h-[70vh] object-contain"
            />

            <div className="mt-4 text-center">
              <p className="uppercase font-bold tracking-wider">
                {icon.name}
              </p>

              <div className="mt-4 flex gap-3 justify-center">
                {icon.svgPath && (
                  <a
                    href={icon.svgPath}
                    download
                    className="bg-yellow-400 text-black px-4 py-2
                               text-sm font-bold uppercase"
                  >
                    Download SVG
                  </a>
                )}

                {icon.pngPath && (
                  <a
                    href={icon.pngPath}
                    download
                    className="bg-yellow-400 text-black px-4 py-2
                               text-sm font-bold uppercase"
                  >
                    Download PNG
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
