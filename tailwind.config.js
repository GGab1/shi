/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#e5e7eb",
        primary: "#6366f1",
        secondary: "#22c55e",
      },
      borderRadius: {
        lg: "12px",
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}
