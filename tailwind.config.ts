// tailwind.config.js
module.exports = {
  darkMode: 'class', // <<--- Esta línea es crucial
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
