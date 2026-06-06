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

      // DS-2 — border radius scale
      borderRadius: {
        none:  "0px",
        xs:    "2px",
        sm:    "4px",
        DEFAULT: "6px",
        md:    "6px",
        lg:    "8px",
        xl:    "12px",
        "2xl": "16px",
        "3xl": "24px",
        full:  "9999px",
      },

      // DS-2 — shadow / elevation scale
      boxShadow: {
        xs:    "0 1px 2px rgba(0,0,0,0.4)",
        sm:    "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
        DEFAULT: "0 4px 6px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        md:    "0 4px 6px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        lg:    "0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)",
        xl:    "0 20px 25px rgba(0,0,0,0.5), 0 10px 10px rgba(0,0,0,0.3)",
        "2xl": "0 25px 50px rgba(0,0,0,0.6)",
        brand: "0 0 0 1px rgba(245,158,11,0.3), 0 4px 12px rgba(245,158,11,0.15)",
        inner: "inset 0 2px 4px rgba(0,0,0,0.4)",
        none:  "none",
      },

      // DS-2/DS-17 — animation tokens
      transitionDuration: {
        instant: "0ms",
        fast:    "120ms",
        default: "200ms",
        slow:    "350ms",
        enter:   "250ms",
        exit:    "180ms",
      },
      transitionTimingFunction: {
        standard:   "cubic-bezier(0.2,0,0,1)",
        emphasized: "cubic-bezier(0.05,0.7,0.1,1)",
        overshoot:  "cubic-bezier(0.34,1.56,0.64,1)",
        enter:      "cubic-bezier(0.0,0.0,0.2,1)",
        exit:       "cubic-bezier(0.4,0.0,1,1)",
      },

      // DS-17 — keyframe animations
      keyframes: {
        "ds-enter":      { from: { opacity:"0", transform:"scale(0.96)" }, to: { opacity:"1", transform:"scale(1)" } },
        "ds-exit":       { from: { opacity:"1", transform:"scale(1)"    }, to: { opacity:"0", transform:"scale(0.96)" } },
        "ds-slide-up":   { from: { opacity:"0", transform:"translateY(8px)"  }, to: { opacity:"1", transform:"translateY(0)" } },
        "ds-slide-down": { from: { opacity:"0", transform:"translateY(-8px)" }, to: { opacity:"1", transform:"translateY(0)" } },
        "ds-scale-in":   { from: { opacity:"0", transform:"scale(0.90)" }, to: { opacity:"1", transform:"scale(1)" } },
        "ds-fade-in":    { from: { opacity:"0" }, to: { opacity:"1" } },
        "ds-toast-in":   { from: { opacity:"0", transform:"translateX(calc(100% + 1rem))" }, to: { opacity:"1", transform:"translateX(0)" } },
      },
      animation: {
        "enter":      "ds-enter 200ms cubic-bezier(0.05,0.7,0.1,1) forwards",
        "exit":       "ds-exit 120ms cubic-bezier(0.2,0,0,1) forwards",
        "slide-up":   "ds-slide-up 200ms cubic-bezier(0.05,0.7,0.1,1) forwards",
        "slide-down": "ds-slide-down 200ms cubic-bezier(0.05,0.7,0.1,1) forwards",
        "scale-in":   "ds-scale-in 200ms cubic-bezier(0.34,1.56,0.64,1) forwards",
        "fade-in":    "ds-fade-in 200ms cubic-bezier(0.2,0,0,1) forwards",
        "toast-in":   "ds-toast-in 250ms cubic-bezier(0.05,0.7,0.1,1) forwards",
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
