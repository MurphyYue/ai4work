/** @type {import('tailwindcss').Config} */
import tailwindCSS from "./tailwind-css-names.js";
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/containers/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/App.tsx",
  ],
  safelist: tailwindCSS, // 保留特定的类名
  theme: {
    extend: {
      aspectRatio: {},
      colors: {},
    },
  },
  plugins: [],
};
