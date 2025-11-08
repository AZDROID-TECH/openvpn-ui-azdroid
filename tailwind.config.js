/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#ea7e23',
          600: '#d9701c',
          700: '#c06015',
        },
        green: {
          500: '#2ecc71',
        },
        red: {
            500: '#e74c3c',
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out-up': {
          'from': { opacity: '1', transform: 'translateY(0)' },
          'to': { opacity: '0', transform: 'translateY(-20px)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'glow-green': {
          '0%, 100%': { filter: 'drop-shadow(0 0 7px rgba(46, 204, 113, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(46, 204, 113, 0.9))' },
        },
        'draw-check': {
            'to': { strokeDashoffset: 0 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-out-up': 'fade-out-up 0.4s ease-out forwards',
        'spin': 'spin 1s linear infinite',
        'glow-green': 'glow-green 2.5s ease-in-out infinite',
        'draw-check': 'draw-check 0.5s ease-out 0.3s forwards',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}