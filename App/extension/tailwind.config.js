/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./popup/popup.html",
    "./options/options.html",
    "./popup/popup.js",
    "./options/options.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#5B9CFF',
          purple: '#8F7CFF',
          orange: '#FF7A5A',
          pink: '#FFB199',
          yellow: '#F6D365',
        }
      }
    },
  },
  plugins: [],
}
