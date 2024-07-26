/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/containers/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/App.tsx",
  ],
  theme: {
    extend: {
      aspectRatio: {},
      colors: {},
    },
  },
  plugins: [],
};
