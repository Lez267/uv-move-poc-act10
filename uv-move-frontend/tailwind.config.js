/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uv-azul': '#18529D',
        'uv-verde': '#28AD56',
        'neuro-base': '#EBF1F8',
        'text-main': '#1D1D1F',
        'text-muted': '#6E6E73'
      }
    },
  },
  plugins: [],
}
