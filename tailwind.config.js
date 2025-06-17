/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4361ee',
        secondary: '#3f37c9',
        success: '#4cc9f0',
        warning: '#f72585',
        background: '#f8f9fa',
        text: {
          DEFAULT: '#2b2d42',
          light: '#8d99ae',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 