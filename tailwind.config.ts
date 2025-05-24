// tailwind.config.js
import animations from '@midudev/tailwind-animations'
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    animations
  ],
}
