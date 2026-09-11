import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        simona: {
          bg: "#111315",
          dark: "#0B0C0E",      // Deepest black for umbrella bar
          surface: "#16191D",   // Architectural surface
          card: "#1E2228",      // Cards and containers
          elevated: "#242A32",
          border: "#2B313A",
          "border-subtle": "#1F242C",
          muted: "#87888A",     // WCAG AAA secondary text
          graphite: "#3E3D40",  // Brandbook Dark Grey
          grey: "#87888A",      // Brandbook Neutral Grey
          "grey-light": "#D7D9DB",
          light: "#F2F3F4",
          white: "#FFFFFF",
          teal: {
            DEFAULT: "#00979C", // Official Simona Turquoise (Pantone 7716 C)
            light: "#00B5BA",
            dark: "#007378",
            hover: "#008489",
          },
          wine: {
            DEFAULT: "#8A151A", // Official Simona Wine (Pantone 7628 C)
            light: "#A61C22",
            dark: "#680D11",
            hover: "#9E1920",
          },
          gold: {
            DEFAULT: "#FDBF3E", // Luxury Gold (Pantone 1225 C)
            light: "#FFE399",
            dark: "#C69224",
          },
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        "light-bezel": "0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        "light-card": "0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        "light-hover": "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 25px -5px rgba(0, 151, 156, 0.12)",
        "double-bezel": "0 16px 36px -10px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 1)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
export default config;
