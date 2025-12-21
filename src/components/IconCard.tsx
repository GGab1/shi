import { useState } from "react"
import type { Icon } from "../types/icon"

type Props = {
  icon: Icon
}

export const IconCard = ({ icon }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="group cursor-pointer bg-zinc-900 border-2 border-zinc-700
                   rounded-md p-3 aspect-square
                   hover:scale-105
                   transition-all duration-200"
      >
        {/* Image */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={icon.svgPath ?? icon.pngPath}
            alt={icon.name}
            className="max-w-full max-h-full object-contain
                       group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          />
        </div>

        {/* Name */}
        <p className="mt-2 text-sm font-bold text-center whitespace-nowrap overflow-hidden text-ellipsis w-full" title={icon.name}>
          {icon.name}
        </p>

        {/* Category */}
        <p className="mt-2 text-center text-xs uppercase text-zinc-500">
          {icon.category}
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
            className="bg-zinc-900 border-4 border-yellow-400 p-6 rounded-lg max-w-[90vw] max-h-[90vh]" >
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
                    className="bg-yellow-400 text-black px-4 py-2 text-sm font-bold uppercase"
                  >
                    Download SVG
                  </a>
                )}

                {icon.pngPath && (
                  <a
                    href={icon.pngPath}
                    download
                    className="bg-yellow-400 text-black px-4 py-2 text-sm font-bold uppercase"
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
