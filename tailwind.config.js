/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // omogućava ručno menjanje dark moda
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#60a5fa", // blue-400
          DEFAULT: "#2563eb", // blue-600
          dark: "#1e3a8a", // blue-900
        },
      },
    },
  },
  plugins: [],
};
