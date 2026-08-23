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
          dark: "#0E1012",
          surface: "#16191D",
          card: "#1C2025",
          border: "#2A2E35",
          muted: "#8A929E",
          teal: {
            DEFAULT: "#00A896",
            light: "#0ABFBC",
            dark: "#008B7C",
            hover: "#02C4B0"
          },
          gold: {
            DEFAULT: "#C8A97E",
            light: "#E0C9A6"
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
export default config;
