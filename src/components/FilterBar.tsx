import { useRef, useState } from "react"

type Props = {
  search: string
  setSearch: (v: string) => void
  categories: string[]
  selectedCategories: string[]
  toggleCategory: (cat: string) => void
  categoryCounts: Record<string, number>
}

export const FilterBar = ({
  search,
  setSearch,
  categories,
  selectedCategories,
  toggleCategory,
  categoryCounts,
}: Props) => {

  const scrollRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const startX = useRef(0)
  const startScroll = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const velocity = useRef(0)
  const momentumId = useRef<number | null>(null)

  const hasDragged = useRef(false)
  const DRAG_THRESHOLD = 6

  const stopMomentum = () => {
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current)
      momentumId.current = null
    }
  }

  const snapToNearest = () => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const children = Array.from(container.children) as HTMLElement[]

    let closest = children[0]
    let closestDist = Infinity

    children.forEach(child => {
      const childCenter =
        child.offsetLeft + child.offsetWidth / 2
      const containerCenter =
        container.scrollLeft + container.offsetWidth / 2
      const dist = Math.abs(containerCenter - childCenter)

      if (dist < closestDist) {
        closestDist = dist
        closest = child
      }
    })

    container.scrollTo({
      left:
        closest.offsetLeft -
        container.offsetWidth / 2 +
        closest.offsetWidth / 2,
      behavior: "smooth",
    })
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    stopMomentum()
    setIsDragging(true)
    hasDragged.current = false
    startX.current = e.pageX
    startScroll.current = scrollRef.current.scrollLeft
    lastX.current = e.pageX
    lastTime.current = performance.now()
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()

    const dx = e.pageX - startX.current
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged.current = true
    }

    scrollRef.current.scrollLeft = startScroll.current - dx

    const now = performance.now()
    const dt = now - lastTime.current
    velocity.current = (lastX.current - e.pageX) / dt

    lastX.current = e.pageX
    lastTime.current = now
  }

  const endDrag = () => {
    if (!isDragging) return
    setIsDragging(false)
    applyMomentum()
  }

  const applyMomentum = () => {
    if (!scrollRef.current) return
    let currentVelocity = velocity.current * 20

    const step = () => {
      if (!scrollRef.current) return
      scrollRef.current.scrollLeft += currentVelocity
      currentVelocity *= 0.92

      if (Math.abs(currentVelocity) > 0.5) {
        momentumId.current = requestAnimationFrame(step)
      } else {
        snapToNearest()
      }
    }

    momentumId.current = requestAnimationFrame(step)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search"
        className="w-full bg-zinc-900 border-2 border-zinc-700
                   px-4 py-3 text-white tracking-wider
                   placeholder-zinc-500 focus:border-yellow-400
                   outline-none"
      />

      {/* Categories */}
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })
          }
          className="shrink-0 bg-zinc-900 border border-zinc-700 px-2 py-1 text-white"
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
            flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1
            select-none
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          `}
        >
          {categories.map(cat => {
            const active = selectedCategories.includes(cat)

            return (
              <button
                key={cat}
                type="button"
                onClick={e => {
                  if (hasDragged.current) {
                    e.preventDefault()
                    return
                  }
                  toggleCategory(cat)
                }}
                className={`
                  shrink-0 px-4 py-2 uppercase font-bold text-sm border-2
                  transition whitespace-nowrap
                  flex items-center gap-2
                  ${
                    active
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-yellow-400"
                  }
                `}
              >
                <span>{cat}</span>

                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full font-bold
                    ${
                      active
                        ? "bg-black/20 text-black"
                        : "bg-zinc-800 text-zinc-400"
                    }
                  `}
                >
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })
          }
          className="shrink-0 bg-zinc-900 border border-zinc-700 px-2 py-1 text-white"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
