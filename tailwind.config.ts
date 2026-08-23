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
          graphite: "#263137", // Brandbook primary dark slate/graphite
          slate: "#717C83",    // Brandbook secondary cool grey
          light: "#F7FAFB",    // Brandbook clean background
          teal: {
            DEFAULT: "#00979C", // Official Simona Brand Turquoise from Figma
            light: "#00B5BA",
            dark: "#007484",
            hover: "#00A8AD"
          },
          gold: {
            DEFAULT: "#FDBF3E", // Brandbook Warm Gold / Amber accent
            light: "#FFE399"
          },
          red: {
            DEFAULT: "#A70725", // Brandbook Dark Red accent
            light: "#DB0D49"
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
};
export default config;
