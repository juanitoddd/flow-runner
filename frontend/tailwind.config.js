/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
    fontFamily: {
      'display': ['Roboto Mono', 'Oswald'],
      'robotic': ['Bebas Neue', 'sans-serif'],
    }
  },
  plugins: [require('flowbite/plugin')],
};
