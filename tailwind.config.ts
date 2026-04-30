import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8C97E",
        bg: "#090806",
        bg2: "#0f0e0b",
        surface: "#181510",
        text: "#F2ECD8",
        muted: "#7A7060",
        muted2: "#5A5040",
      },
      backgroundColor: {
        "gold-dim": "rgba(201,168,76,0.12)",
      },
      borderColor: {
        "gold-border": "rgba(201,168,76,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
