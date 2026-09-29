/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a8b86',
        'teal-bg': '#d9ebe6',
        'beige': '#fbf5ee',
        'dark-teal': '#1f5550',
        'light-teal': '#a4c9bf',
        'primary-dark': '#24493f',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        lora: ['Lora', 'serif'],
        jost: ['Jost', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
