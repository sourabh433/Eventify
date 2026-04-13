/** @type {import('tailwindcss').config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },

      // Optional: better colors (calm blue system)
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },

      // Optional: smoother shadows (premium feel)
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.05)',
        card: '0 8px 20px rgba(59,130,246,0.08)',
      },

      // Optional: better border radius
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },
    },
  },
  plugins: [],
}