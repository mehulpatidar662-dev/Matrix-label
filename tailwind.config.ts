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
        bg: "#F4F3EF",
        card: "#FAF9F7",
        border: "#E5E4E0",
        ink: "#181814",
        body: "#605C58",
        accent: {
          red: "#D4443C",
          darkred: "#A6342C",
          tint: "#F7E5E0",
        },
        lime: {
          annotation: "#C8FC00",
        },
        dark: {
          surface: "#191817",
        },
        metric: {
          purple: "#8848F4",
          blue: "#3C6CA0",
          amber: "#C08818",
          green: "#349858",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        hover: "0 14px 40px rgba(0,0,0,0.10)",
        glow: "0 0 40px rgba(212,68,60,0.25)",
      },
      borderRadius: {
        card: "24px",
        media: "28px",
        banner: "32px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-slow": "pulseSlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
