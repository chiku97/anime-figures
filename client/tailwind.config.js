/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coastal Habitat palette mapped to CSS variables
        primary: 'var(--color-primary-charcoal)', // Main text, headings
        secondary: 'var(--color-secondary-warm-grey)', // Secondary text
        accent: 'var(--color-accent-sage)', // Buttons, accents
        luxury: 'var(--color-luxury-gold)', // Premium labels, offers
        background: 'var(--color-warm-white)', // Page background
        card: 'var(--card-bg)', // Card background
        sage: 'var(--color-sage)',
        clay: 'var(--color-clay)',
        gold: 'var(--color-luxury-gold)',
        // Preserve legacy anime colors (optional)
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
        },
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
        'slideInRight': 'slideInRight 0.3s ease-out',
        'slideInLeft': 'slideInLeft 0.3s ease-out',
        'fadeOut': 'fadeOut 0.3s ease-in forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 85, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(255, 0, 85, 0.6), 0 0 25px rgba(255, 0, 85, 0.3)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(110%)' }
        }
      }
    },
  },
  plugins: [],
}
