/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          bg: '#0a0a0c',
          card: '#131317',
          darker: '#060608',
          pink: '#ff0055',
          pinkGlow: '#ff007f',
          cyan: '#00f3ff',
          purple: '#9d4edd',
          border: '#1f1f23',
          textMuted: '#9a9aa2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        manga: ['"Bangers"', 'sans-serif'] // For bold manga titles
      },
      boxShadow: {
        'neon-pink': '0 0 10px rgba(255, 0, 85, 0.4), 0 0 20px rgba(255, 0, 85, 0.2)',
        'neon-cyan': '0 0 10px rgba(0, 243, 255, 0.4), 0 0 20px rgba(0, 243, 255, 0.2)',
        'neon-purple': '0 0 10px rgba(157, 78, 221, 0.4), 0 0 20px rgba(157, 78, 221, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 85, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(255, 0, 85, 0.6), 0 0 25px rgba(255, 0, 85, 0.3)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    },
  },
  plugins: [],
}
