/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        'bg-image': "url('/bg-image.png')",
      },
      fontFamily: {
        'sans': ['Segoe UI Light', 'Segoe', 'SegoeUI-Light-final', 'Tahoma', 'Helvetica, Arial', 'sans-serif']
      },
      colors: {
        primary: '#5c6ac4',
        secondary: '#ecc94b',
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

