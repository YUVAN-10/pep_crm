/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1677FF',
          hover: '#0958D9',
          deep: '#003EB3',
          light: '#E8F3FF',
          accent: '#F59E0B',
          cream: '#FFF7ED',
          bg: '#F0F4F8',
          card: '#FFFFFF',
          border: '#E5E9F0',
          textPrimary: '#1F2937',
          textSecondary: '#64748B',
        },
        status: {
          success: '#10B981',
          danger: '#F43F5E',
          warning: '#F59E0B',
          info: '#1677FF',
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'default': '18px',
        'card': '22px',
        'button': '14px',
        'input': '9999px',
        'subcard': '18px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(22, 119, 255, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 20px 40px -10px rgba(22, 119, 255, 0.08), 0 8px 10px -4px rgba(0, 0, 0, 0.03)',
        'blue-glow': '0 10px 25px -3px rgba(22, 119, 255, 0.25)',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #EEF5FF 0%, #FFFFFF 100%)',
        'green-gradient': 'linear-gradient(135deg, #E6F8F0 0%, #FFFFFF 100%)',
        'rose-gradient': 'linear-gradient(135deg, #FDF0F0 0%, #FFFFFF 100%)',
      }
    },
  },
  plugins: [],
}
