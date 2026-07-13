/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naturista: {
          primary: '#3B7A57',
          'primary-hover': '#2C5F44',
          'primary-light': '#D9EFDC',
          secondary: '#8BAA6F',
          warm: '#8D6E63',
          bg: '#F7F5EF',
          surface: '#FFFFFF',
          text: '#26332B',
          'text-muted': '#5C6B60',
          success: '#4CAF50',
          warning: '#D9A441',
          error: '#C1503A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
