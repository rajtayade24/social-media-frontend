/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure JSX is included
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
   variants: {
    scrollbar: ['rounded'], // ✅ enables scrollbar utilities
  },
};
