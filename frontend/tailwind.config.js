/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        'bg-image': "url('/bg-image.png')",
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

