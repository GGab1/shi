import { useEffect, useState } from "react"

export const CommissionBanner = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const closed = localStorage.getItem("commission-banner-closed")
    if (closed === "true") setVisible(false)
  }, [])

  const close = () => {
    localStorage.setItem("commission-banner-closed", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="sticky top-0 z-50 w-full bg-yellow-400 text-black">
      <div className="relative flex items-center justify-center px-4 py-3">

        {/* Text */}
        <p className="text-sm leading-relaxed max-w-5xl mx-auto">

          <p className="font-extrabold uppercase">
            Commissions open!
          </p>{" "}
          <p>
            I’m currently working alone on this project, alongside my personal life.
            I carefully consider all suggestions, but{" "}
            <span className="underline">
              please submit each character only once
            </span>.
            Creating icons takes time, thank you for your patience and understanding.
          </p>
        </p>

        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-1/2 -translate-y-1/2
                     w-8 h-8 rounded-full
                     flex items-center justify-center
                     text-black text-xl font-extrabold
                     bg-transparent transition"
        >
          ×
        </button>
      </div>
    </div>
  )
}
