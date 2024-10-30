/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customOrange: "#cc5803",
        customLightOrange: "#F7934C",
        customOtherOrange: '#FC9D59'
      },
      spacing: {
        '1/8': '12.5%', // 1/8 of 100% width
      },
    },
  },
  plugins: [],
}