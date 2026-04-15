/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        gold: '#c89b3c',
        'tft-dark': '#0d0f17',
        'tft-panel': '#13162a',
        'tft-border': '#1e2240',
      },
    },
  },
  plugins: [],
}
