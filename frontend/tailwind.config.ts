import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-tajawal)', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          accent: '#111827'
        }
      },
      boxShadow: {
        'glow': '0 0 15px -3px rgba(16, 185, 129, 0.4), 0 0 6px -2px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
