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
        bg:      "#000000",
        surface: "#0a1628",
        border:  "#0e2a4a",
        accent1: "#0077b6",
        accent2: "#00b4d8",
        accent3: "#90e0ef",
        muted:   "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0077b6, #00b4d8)",
      },
      boxShadow: {
        "glow":  "0 0 24px rgba(0,180,216,0.3)",
        "card":  "0 8px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
