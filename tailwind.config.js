/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d0ff',
          300: '#e9a8ff',
          400: '#d970ff',
          500: '#c840f5',
          600: '#ac1ed9',
          700: '#9118b5',
          800: '#771895',
          900: '#621879',
        },
      },
    },
  },
  plugins: [],
}
