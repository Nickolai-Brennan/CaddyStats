/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // DS-5 — brand primary (amber)
      colors: {
        brand: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // DS-5 — chart palette
        chart: {
          1: "#f59e0b",
          2: "#38bdf8",
          3: "#a78bfa",
          4: "#34d399",
          5: "#fb7185",
          6: "#fb923c",
          7: "#a3e635",
          8: "#e879f9",
        },
        // DS-5 — analytics tokens
        analytics: {
          projection: "#a3e635",
          confidence: "#38bdf8",
          risk:       "#fb7185",
          ownership:  "#a78bfa",
          edge:       "#34d399",
          trend:      "#f59e0b",
        },
        // DS-5 — surface elevations exposed as Tailwind utilities
        surface: {
          base:    "#060b14",
          raised:  "#0f172a",
          overlay: "#1e293b",
          sunken:  "#0b1120",
          accent:  "#172033",
        },
      },

      // DS-5 — border colors via CSS var()
      borderColor: ({ theme }) => ({
        ...theme("colors"),
        subtle:  "rgba(148,163,184,0.10)",
        DEFAULT: "rgba(148,163,184,0.18)",
        strong:  "rgba(148,163,184,0.30)",
      }),

      // DS-7 — sidebar width token
      width: {
        sidebar:          "15rem",
        "sidebar-collapsed": "3.5rem",
      },

      // Animation tokens
      transitionDuration: {
        fast:    "120ms",
        default: "200ms",
        slow:    "350ms",
      },
      transitionTimingFunction: {
        standard:   "cubic-bezier(0.2,0,0,1)",
        emphasized: "cubic-bezier(0.05,0.7,0.1,1)",
      },

      // Focus ring
      ringColor: {
        DEFAULT: "#f59e0b",
        brand:   "#f59e0b",
      },
    },
  },
  plugins: [],
};
