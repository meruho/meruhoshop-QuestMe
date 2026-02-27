/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'miru-blue':    '#3498DB',
        'quokka-green': '#2ECC71',
        'red-shield':   '#E74C3C',
        'pixel-bg':     '#F0EAD6',
        'pixel-card':   '#FFFDF5',
        'pixel-dark':   '#1A1A2E',
        'exp-yellow':   '#F1C40F',
        'exp-orange':   '#E67E22',
      },
      fontFamily: {
        pixel: ['"NeoDunggeunmo"', '"Galmuri11"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'pixel':    '4px 4px 0px 0px #000000',
        'pixel-sm': '2px 2px 0px 0px #000000',
        'pixel-lg': '6px 6px 0px 0px #000000',
        'pixel-in': '2px 2px 0px 0px #000000 inset',
      },
      keyframes: {
        'pixel-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'pop-up': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'sparkle': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0) translateY(-30px)' },
        },
      },
      animation: {
        'pixel-shake': 'pixel-shake 0.3s ease-in-out',
        'pop-up':      'pop-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float':       'float 3s ease-in-out infinite',
        'sparkle':     'sparkle 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
