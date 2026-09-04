/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepGreen: '#294D45',
          deepGreenDark: '#1E3933',
          maroon: '#7A3038',
          cyan: '#72D6D4',
          cyanDark: '#4DB6B4',
          bgLight: '#F5F5F3',
          textDark: '#1A1A1A',
          cardBg: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(114, 214, 212, 0.4)',
        'glow-green': '0 0 15px rgba(41, 77, 69, 0.3)',
      }
    },
  },
  plugins: [],
}
