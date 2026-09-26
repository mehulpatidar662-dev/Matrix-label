import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#F8FAFC", // Clean modern slate-50
          dark: "#0A0D14",  // Deep Obsidian
        },
        surface: {
          light: "#FFFFFF",
          dark: "#111827",
          subtleLight: "#F1F5F9",
          subtleDark: "#1E293B",
        },
        borderRule: {
          light: "#E2E8F0",
          dark: "#334155",
        },
        brand: {
          indigo: "#4F46E5",
          indigoDark: "#6366F1",
          blue: "#2563EB",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        display: ["'Outfit'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
        mono: ["'DM Mono'", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(79, 70, 229, 0.25)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.25)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "laser-scan": "laserScan 3s ease-in-out infinite",
      },
      keyframes: {
        laserScan: {
          "0%, 100%": { top: "5%" },
          "50%": { top: "90%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
