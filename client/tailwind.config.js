/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EAE1D7',
          400: '#DFD1C2',
          500: '#C9B5A0',
        },
        deepbrown: {
          800: '#4A2E1E',
          900: '#3D2619',
          950: '#2B1810',
          muted: '#6B4F3B',
        },
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          DEFAULT: '#E65100',
        },
        warmamber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          DEFAULT: '#FFB300',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(61, 38, 25, 0.08), 0 5px 15px -5px rgba(61, 38, 25, 0.04)',
        'premium-hover': '0 20px 40px -10px rgba(230, 81, 0, 0.15), 0 10px 20px -5px rgba(61, 38, 25, 0.06)',
      }
    },
  },
  plugins: [],
}
