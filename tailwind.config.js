/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#80CBC4',
          mint: '#A3D8C6',
          purple: '#6C5B7B',
          lavender: '#C8A2C8',
        },
        accent: {
          yellow: '#FFC107',
          orange: '#FF9800',
        },
        neutral: {
          light: '#E3E6FA',
          dark: '#424242',
          white: '#FFFFFF',
        },
      }
    },
  },
  plugins: [],
}

