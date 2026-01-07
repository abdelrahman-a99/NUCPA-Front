import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        teal: "rgb(var(--teal) / <alpha-value>)",
        "teal-bright": "rgb(var(--teal-bright) / <alpha-value>)",

        "new-yellow": "rgb(var(--new-yellow) / <alpha-value>)",

        ink2: "rgb(var(--ink2) / <alpha-value>)",
        teal2: "rgb(var(--teal2) / <alpha-value>)",
        red: "rgb(var(--red) / <alpha-value>)",
        footer: "rgb(var(--footer) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        pixel: ["NT Brick Sans", "monospace"],
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        scroll: "scroll 30s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
