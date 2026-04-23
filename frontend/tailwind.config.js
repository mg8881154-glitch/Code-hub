/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light mode custom colors
        'light-bg': '#f0f4f8',
        'light-card': '#ffffff',
        'light-border': '#e2e8f0',
        'light-text': '#1a202c',
        'light-muted': '#64748b',
      }
    }
  },
  plugins: [],
}
